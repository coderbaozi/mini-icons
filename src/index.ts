import path, { dirname } from 'node:path'
import fs from 'node:fs'
import MagicString from 'magic-string'
import type { Plugin } from 'vite'
import { parse } from 'svg-parser'
import type { ElementNode, RootNode, TextNode } from 'svg-parser'

export interface Options { }
interface IconDependency {
  iconName: string
  iconPath: string
}

function dashToCamelCase(str: string): string {
  const words = str.split('-')
  const firstWord = words[0]
  const restWords = words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1))
  const camelCase = [firstWord, ...restWords].join('')
  return camelCase
}

function convertAst(ast: RootNode | ElementNode | TextNode, depBlocks: string[]) {
  // @ts-expect-error let me see
  const { children = false } = ast
  if (children.length) {
    for (const child of children) {
      for (const key in child.properties) {
        if (key.includes('-'))
          depBlocks.push(key)
      }
      convertAst(child, depBlocks)
    }
  }
  return depBlocks
}

function preHandleSvg(svgCode: string) {
  const depBlocks: string[] = []
  // recursion the ast to remove width and height
  // and change dash name to small camel name style
  const ast = parse(svgCode)
  return convertAst(ast, depBlocks)
}

function isExistFile(name: string) {
  return fs.existsSync(name)
}

const TYPE_FILE_NAME = 'svg.d.ts'
const SVG_FILE_DATA = `declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGSVGElement>>
  export default content
}`

let typeFilePath: null | string = null

const importRE = /import (.+) from ['"]([^'"]+\.svg)['"]/g
export default function (_options: Options = {}): Plugin {
  return {
    name: 'vite-plugin-icon',
    enforce: 'pre',
    resolveId(_source, importer) {
      if (importer?.includes('index.html') && typeFilePath === null) {
        typeFilePath = path.join(dirname(importer), TYPE_FILE_NAME)
        if (!isExistFile(typeFilePath))
          fs.writeFileSync(typeFilePath!, SVG_FILE_DATA, { encoding: 'utf-8' })
      }
    },
    async transform(code, id) {
      const s = new MagicString(code)
      // when use `import <IconName> from '~/assets/icon/<icon.svg>`
      const matchs = Array.from(code.matchAll(importRE))
      if (!matchs.length)
        return
      const dependencyFile: IconDependency[] = []
      for (const match of matchs) {
        const IconInfo = {
          iconName: match[1],
          iconPath: match[2],
        }
        s.replace(match[1], `_${match[1]}`)
        dependencyFile.push(IconInfo)
      }
      if (dependencyFile.length) {
        for (const file of dependencyFile) {
          const svgCode = fs.readFileSync(path.join(dirname(id), file.iconPath), 'utf-8')
          const depBlocks = preHandleSvg(svgCode)
          const enhanceSvgCode = new MagicString(svgCode)
          for (const block of depBlocks)
            enhanceSvgCode.replace(block, dashToCamelCase(block))
          enhanceSvgCode.replace(/width="(\d+)" height="(\d+)"/, '')
          const iconComponent = `const ${file.iconName} = ( {style} ) => {
            return (<span style={{display: 'inline-flex',...style}} >${enhanceSvgCode.toString()}</span>)
          }\n`
          s.append(iconComponent)
        }
      }

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },
  }
}
