# floema


### Useful links
https://transfonter.org/


### Ajax page transition

```js
async onChange (url) {
  await this.page.hide()

  const request = await window.fetch(url)

  if (request.status === 200) {
    const html = await request.text()
    const div = document.createElement('div')
    div.innerHTML = html

    const divContent = div.querySelector('.content')

    this.template = divContent.getAttribute('data-template')
    this.content.setAttribute('data-template', this.template)
    this.content.innerHTML = divContent.innerHTML

    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()

    this.addLinkListerners()
  } else {
    console.log('Error')
  }
}

addLinkListerners () {
  const links = document.querySelectorAll('a')
  each(links, link => {
    link.onclick = event => {
      event.preventDefault()

      const { href } = link

      this.onChange(href)
    }
  })
}
```


### Handling events

We use events lib to handle events through different classes

```js
//Preloader.js
setTimeout(_ => {
    this.emit('completed')
  }, 1000)

//App.js
this.preloader.once('completed', this.onPreloaded)
```




### Async Load images

Use data-src instead of src and use AsyncLoad.js which use intersectionObserver to load on scroll


### Infinite draggable gallery

Basically, we position the webgl textyres images using the getBoundingClientRect() of each element and their sizes.
Then, we use onTouchMove, onTouchDown & onTouchUp to calculate the position of the mouse while dragging (we had lerp to have a velocity effect)
Finally, we detect when a mesh is out of the window by using his position & the window width. We then add/substract the gallery width from his position to re-position it correctly, giving the feel of an infinite scroll


### KACPER.ch homepage distortion
See video implementing vertex distortion using GLSL code min 5
vertex.glsl
```
vUv = uV;
vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * abs(uStrength);
gl_Position = projectionMatrix * newPosition;
```

Transforms translate are gpu intensive, it's always better to move the camera than the element.


Get the vector position for the dragging transform
https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
