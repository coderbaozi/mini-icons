# mini-icons

It is more convenient to use svg as a component in jsx

### Features

- ✅ Convenient
  you can use svg as a component in your jsx or tsx file
- ⚡ On-Demand
  transform only if you use the svg icon
- 💪 TypeScript

### Usage

Use directly in your jsx file like below

```
import ReactLogo from './assets/react.svg'
import Boom from './assets/boom.svg'
function App() {
  return (
    <>
      <ReactLogo style={{ width: 30, height: 30 }} />
      <Boom style={{ width: 30, height: 30 }} />
    </>
  )
}
```

### Install

npm i -D vite-plugin-icon
import the plugin in vite

```
import Icons from 'vite-plugin-icon'
export default defineConfig({
  plugins: [Icons()],
})
```

### Plugin run steps

- genreate a `svg.d.ts` file
- transform the svg to a jsx component

### License

MIT License
