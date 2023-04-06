import { EVENTTYPES } from '../common'
import { _support } from '../utils/global'

/**
 * 事件中转
 */

interface Callback {
  (...args: any[]): void
}

interface EventHandler {
  type: EVENTTYPES
  callback: Callback
}

type Handlers = {
  [key in EVENTTYPES]?: Callback[]
}

export class EventBus {
  private handlers: Handlers
  constructor() {
    this.handlers = {}
  }
  /**
   * 为目标类型事件添加回调
   * @param handler 需要被添加的类型以及回调函数
   */
  addEvent(handler: EventHandler) {
    !this.handlers[handler.type] && (this.handlers[handler.type] = [])
    const funIndex = this._getCallbackIndex(handler)
    if (funIndex === -1) {
      this.handlers[handler.type]?.push(handler.callback)
    }
  }
  /**
   * 为目标类型事件删除回调
   * @param handler 需要被删除的类型以及回调函数
   */
  delEvent(handler: EventHandler) {
    const funIndex = this._getCallbackIndex(handler)
    if (funIndex !== -1) {
      this.handlers[handler.type]?.splice(funIndex, 1)
    }
  }
  /**
   * 为目标类型事件更改回调
   * @param handler 需要被更改的类型以及回调函数
   * @param newCallback 新的回调函数
   */
  changeEvent(handler: EventHandler, newCallback: Callback) {
    const funIndex = this._getCallbackIndex(handler)
    if (funIndex !== -1) {
      this.handlers[handler.type]?.splice(funIndex, 1, newCallback)
    }
  }
  /**
   * 获取目标类型事件所有的回调
   * @param type 事件类型
   */
  getEvent(type: EVENTTYPES) {
    return this.handlers[type] || []
  }
  /**
   * 执行目标类型事件所有的回调
   * @param type 事件类型
   * @param args 额外参数
   */
  runEvent(type: EVENTTYPES, ...args: any[]) {
    const allEvent = this.getEvent(type)
    allEvent.forEach(fun => {
      fun(...args)
    })
  }
  /**
   * 获取函数在 callback 列表中的位置
   */
  private _getCallbackIndex(handler: EventHandler): number {
    if (this.handlers[handler.type]) {
      const callbackList = this.handlers[handler.type]
      if (callbackList) {
        return callbackList.findIndex(fun => fun === handler.callback)
      } else {
        return -1
      }
    } else {
      return -1
    }
  }
}

const eventBus = _support.eventBus || (_support.eventBus = new EventBus())

export { eventBus }
