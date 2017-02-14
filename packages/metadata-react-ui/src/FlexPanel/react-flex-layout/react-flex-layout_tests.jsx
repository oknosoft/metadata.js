import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import Layout from './react-flex-layout.jsx'
import TestUtils from 'react-addons-test-utils'
import layoutEvents from './react-flex-layout-events.jsx'

document.body.style.margin = 0

class TestThingo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>Test thingo content</div>
  }
}

describe('react-flex-layout', function() {
  it('can fill the browser frame', function() {
    var layout = TestUtils.renderIntoDocument(<Layout fill='window' />)
    var domLayout = ReactDOM.findDOMNode(layout)
    expect(domLayout.style.height).toBe(window.innerHeight + 'px')
    expect(domLayout.style.width).toBe(window.innerWidth + 'px')
    expect(domLayout.style.position).toBe('absolute')
    expect(domLayout.style.left).toBe('0px')
    expect(domLayout.style.top).toBe('0px')
  })

  it('can fill the containing element', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '50%'
    document.body.appendChild(container)
    var layout = ReactDOM.render(<Layout fill='container' />, container)
    var domLayout = ReactDOM.findDOMNode(layout)
    expect(domLayout.offsetHeight).toBe(500)
    var difference = domLayout.offsetWidth - (window.innerWidth / 2)
    expect(difference).toBeLessThan(1, 'differnce was greater than 1')
  })

  it('can have two flex width children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutWidth='flex' />
          <Layout layoutWidth='flex' />
        </Layout>
      var layout = ReactDOM.render(toRender, container)
      var domLayout = ReactDOM.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(500)
      expect(flex1.offsetWidth).toBe(250)
      expect(flex2.offsetHeight).toBe(500)
      expect(flex2.offsetWidth).toBe(250)
  })

  it('can have two flex height children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutHeight='flex' />
          <Layout layoutHeight='flex' />
        </Layout>
      var layout = ReactDOM.render(toRender, container)
      var domLayout = ReactDOM.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(250)
      expect(flex1.offsetWidth).toBe(500)
      expect(flex2.offsetHeight).toBe(250)
      expect(flex2.offsetWidth).toBe(500)
  })

  it('can have one fixed and one flex width children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutWidth={100} />
          <Layout layoutWidth='flex' />
        </Layout>
      var layout = ReactDOM.render(toRender, container)
      var domLayout = ReactDOM.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetWidth).toBe(100)
      expect(flex2.offsetWidth).toBe(400)
  })

  it('can have one fixed and one flex height children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutHeight={100} />
          <Layout layoutHeight='flex' />
        </Layout>
      var layout = ReactDOM.render(toRender, container)
      var domLayout = ReactDOM.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(100)
      expect(flex2.offsetHeight).toBe(400)
  })

  it('when child is resized flex widths are recalculated', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var toRender = <Layout fill='container'>
        <Layout layoutWidth={100} />
        <Layout layoutWidth='flex' />
      </Layout>
    var layout = ReactDOM.render(toRender, container)
    layout.refs.layout0.setWidth(110)
    var domLayout = ReactDOM.findDOMNode(layout)
    var fixed = domLayout.children[0]
    var flex2 = domLayout.children[1]
    expect(fixed.offsetWidth).toBe(110)
    expect(flex2.offsetWidth).toBe(390)
  })

  it('throws when invalid layout width is specified', function() {
    expect(() => TestUtils.renderIntoDocument(<Layout layoutWidth='100' />)).toThrow()
  })

  it('Children of layout are rendered', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var toRender = <Layout fill='container'>
        <Layout layoutWidth={100}><TestThingo /></Layout>
        <Layout layoutWidth='flex'><TestThingo /></Layout>
      </Layout>
    var layout = ReactDOM.render(toRender, container)
    var found = TestUtils.scryRenderedComponentsWithType(layout, TestThingo)
    expect(found.length).toBe(2)
  })

  it('Child text of layout is rendered', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var toRender = <Layout fill='container'>
        <Layout layoutWidth={100}><TestThingo /></Layout>
        <Layout layoutWidth='flex'>SomethingElse</Layout>
      </Layout>
    var layout = ReactDOM.render(toRender, container)
    var layoutNode = ReactDOM.findDOMNode(layout.refs.layout1)
    expect(layoutNode.innerText).toContain('SomethingElse')
  })

  it('Can nest', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutHeight={100}>Header</Layout>
          <Layout layoutHeight='flex'>
            <Layout layoutWidth={100}>Column 1</Layout>
            <Layout layoutWidth='flex'>Flex column</Layout>
          </Layout>
        </Layout>
      var layout = ReactDOM.render(toRender, container)
      var verticalContainer = layout.refs.layout1
      var layoutNode = ReactDOM.findDOMNode(layout)
      expect(layoutNode.children[0].offsetHeight).toBe(100)
      expect(layoutNode.children[1].offsetHeight).toBe(400)
      expect(layoutNode.children[0].offsetWidth).toBe(500)
      expect(layoutNode.children[1].offsetWidth).toBe(500)

      var verticalContainerNode = ReactDOM.findDOMNode(verticalContainer)
      expect(verticalContainerNode.children[0].offsetWidth).toBe(100)
      expect(verticalContainerNode.children[1].offsetWidth).toBe(400)
      expect(verticalContainerNode.children[0].offsetHeight).toBe(400)
      expect(verticalContainerNode.children[1].offsetHeight).toBe(400)
  })

  it('Resizes when layout-changed is triggered', () => {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var toRender = <Layout fill='container'>
        <Layout layoutHeight={100}>Header</Layout>
        <Layout layoutHeight='flex'>Content</Layout>
      </Layout>
    var layout = ReactDOM.render(toRender, container)
    var layoutNode = ReactDOM.findDOMNode(layout)

    container.style.height = '400px'
    layoutEvents.emit('layout-changed')

    expect(layoutNode.children[0].offsetHeight).toBe(100)
    expect(layoutNode.children[1].offsetHeight).toBe(300)
  })

  it('throws when invalid layout width is specified', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
    expect(() => ReactDOM.render(<Layout><Layout /></Layout>, container)).toThrow()
  })

  it('Can add classname to layout', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var rendered = ReactDOM.render(<Layout className='outer'><Layout className='inner' layoutWidth='flex' /></Layout>, container)
    var renderedNode = ReactDOM.findDOMNode(rendered)
    var innerNode = ReactDOM.findDOMNode(rendered.refs.layout0)
    expect(renderedNode.className).toBe('outer')
    expect(innerNode.className).toBe('inner')
  })

  it('Can add style to layout', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var rendered = ReactDOM.render(<Layout style={{border: '1px solid #000'}}>
        <Layout style={{backgroundColor: '#eee'}} layoutWidth='flex' />
      </Layout>, container)
    var renderedNode = ReactDOM.findDOMNode(rendered)
    var innerNode = ReactDOM.findDOMNode(rendered.refs.layout0)
    expect(renderedNode.getAttribute('style')).toContain('border: 1px solid rgb(0, 0, 0)')
    expect(innerNode.getAttribute('style')).toContain('background-color:#eee')
  })
})
