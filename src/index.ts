import path, { dirname } from 'node:path'
import fs from 'node:fs'
import MagicString from 'magic-string'
import type { Plugin } from 'vite'
import { parse } from 'svg-parser'

export interface Options {}
interface IconDependency {
  iconName: string
  iconPath: string
}

function preHandleSvg(svgCode: string) {
  const ast = parse(svgCode)
  // recursion the ast to remove width and height
  // and change dash name to small hump name style
  return ast
}

const importRE = /import (.+) from ['"]([^'"]+\.svg)['"]/g
export default function (_options: Options = {}): Plugin {
  return {
    name: 'vite-plugin-icon',
    enforce: 'pre',
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
          preHandleSvg(svgCode)
          const iconComponent = `const ${file.iconName} = () => {
            return (${svgCode})
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
