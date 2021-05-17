import each from 'lodash/each'
import About from 'pages/about'
import Collections from 'pages/collections'
import Detail from 'pages/detail'
import Home from 'pages/home'
import Preloader from './components/Preloader'

class App {
  constructor () {
    this.createPreloader()
    this.createContent()
    this.createPages()
    this.addLinkListerners()
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  onPreloaded () {
    this.preloader.destroy()
    this.page.show()
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home()
    }
    this.page = this.pages[this.template]
    this.page.create()

  }

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
}

new App()
