export abstract class Module<C = any, M = any, E = any> {
  private static instance: any

  public static init(this: any) {
    if (!this.instance) this.instance = new this()
    return this.instance
  }

  public abstract runModule(C)

  public abstract runMicroservice(M)

  public export(): E {
    return {} as E
  }
}
