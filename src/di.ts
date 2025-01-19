export class DI<T, K = any> {
  private globalDi: DI<K> | any

  private instances: { [key in keyof T]: T[key] } = {} as { [key in keyof T]: T[key] }

  constructor(globalDi: DI<K> | any = null) {
    this.globalDi = globalDi
  }

  public set<K extends keyof T>(key: K, instance: T[K]): void {
    this.instances[key] = instance
  }

  public get<K extends keyof T>(key: K): T[K] {
    const instance = this.instances[key] || this.globalDi?.get(key)
    if (!instance) throw new Error(`"${(key as string).toString()}" is not specified. Please use DI.set(key, instance) before`)
    return instance
  }
}
