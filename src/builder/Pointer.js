import { Event } from './Event'

export class Pointer {
    constructor(element) {
        Object.assign(this, { element })
        this.event = new Event()

        this.pos = { x: 0, y: 0 }
        this.vel = { x: 0, y: 0 }

        this.pointerInteractionCount = 0
        this.pointerInteractionTimeout = null

        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onMouseStart = this.onMouseStart.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseEnd = this.onMouseEnd.bind(this)

        if (this.isTouchDevice()) {
            this.element.addEventListener('touchstart', this.onTouchStart, { passive: false })
            this.element.addEventListener('touchmove', this.onTouchMove)
            this.element.addEventListener('touchend', this.onTouchEnd)
        } else {
            this.element.addEventListener('mousedown', this.onMouseStart)
            this.element.addEventListener('mousemove', this.onMouseMove)
            this.element.addEventListener('mouseup', this.onMouseEnd)
        }
    }
    on(event, callback, bind) {
        return this.event.on(event, callback, bind)
    }
    off(event, callback, bind) {
        this.event.off(event, callback, bind)
    }
    onTouchStart(event) {
        this.onPointerStart(event.touches[0])
    }
    onTouchMove(event) {
        this.onPointerMove(event.touches[0])
    }
    onTouchEnd(event) {
        this.onPointerEnd(event.changedTouches[0])
    }
    onMouseStart(event) {
        this.isMouseDown = true
        this.onPointerStart(event)
    }
    onMouseMove(event) {
        if (this.isMouseDown) this.onPointerMove(event)
    }
    onMouseEnd(event) {
        this.onPointerEnd(event)
        this.isMouseDown = false
    }
    onPointerStart(event) {
        this.startPointerMultiInteraction()

        const { clientX, clientY } = event
        const { x: xRelative, y: yRelative } = this.getCanvasRelativePosition({ x: clientX, y: clientY })
        const { x, y } = this.get3DWorldPosition({ x: xRelative, y: yRelative })
        this.vel.x = 0
        this.vel.y = 0
        this.pos.x = x
        this.pos.y = y
        this.event.emit('start', { x, y, xv: this.vel.x, yv: this.vel.y })
    }
    onPointerMove(event) {
        this.resetPointerMultiInteraction()

        const { clientX, clientY } = event
        const { x: xRelative, y: yRelative } = this.getCanvasRelativePosition({ x: clientX, y: clientY })
        const { x, y } = this.get3DWorldPosition({ x: xRelative, y: yRelative })
        this.vel.x = x - this.pos.x
        this.vel.y = y - this.pos.y
        this.pos.x = x
        this.pos.y = y
        this.event.emit('move', { x, y, xv: this.vel.x, yv: this.vel.y })
    }
    onPointerEnd(event) {
        const { clientX, clientY } = event
        const { x: xRelative, y: yRelative } = this.getCanvasRelativePosition({ x: clientX, y: clientY })
        const { x, y } = this.get3DWorldPosition({ x: xRelative, y: yRelative })
        this.vel.x = 0
        this.vel.y = 0
        this.pos.x = x
        this.pos.y = y
        this.event.emit('end', { x, y, xv: this.vel.x, yv: this.vel.y })
    }
    startPointerMultiInteraction() {
        this.pointerInteractionCount++
        clearTimeout(this.pointerInteractionTimeout)
        this.pointerInteractionTimeout = setTimeout(() => {
            this.event.emit('multi', { count: this.pointerInteractionCount })
            this.resetPointerMultiInteraction()
        }, 250)
    }
    resetPointerMultiInteraction() {
        this.pointerInteractionCount = 0
        clearTimeout(this.pointerInteractionTimeout)
    }
    getCanvasRelativePosition({ x, y } = {}) {
        const rect = this.element.getBoundingClientRect()
        return {
            x: ((x - rect.left) * this.element.width) / rect.width,
            y: ((y - rect.top) * this.element.height) / rect.height,
        }
    }
    get3DWorldPosition({ x, y } = {}) {
        return {
            x: (x / this.element.width) * 2 - 1,
            y: (y / this.element.height) * -2 + 1,
        }
    }
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    }
    destroy() {
        if (this.isTouchDevice()) {
            this.element.removeEventListener('touchstart', this.onTouchStart, { passive: false })
            this.element.removeEventListener('touchmove', this.onTouchMove)
            this.element.removeEventListener('touchend', this.onTouchEnd)
        } else {
            this.element.removeEventListener('mousedown', this.onMouseStart)
            this.element.removeEventListener('mousemove', this.onMouseMove)
            this.element.removeEventListener('mouseup', this.onMouseEnd)
        }
    }
}
