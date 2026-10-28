export class DocumentHistory {
  private past: string[] = [];
  private future: string[] = [];
  private lastTime = 0;
  private boundary = true;
  constructor(
    public current: string,
    private maxBytes = 20 * 1024 * 1024,
  ) {}
  isolate() {
    this.boundary = true;
  }
  record(source: string, time = Date.now()) {
    if (source === this.current) return;
    if (this.boundary || time - this.lastTime > 650 || !this.past.length)
      this.past.push(this.current);
    this.current = source;
    this.future = [];
    this.lastTime = time;
    this.boundary = false;
    let bytes = this.past.reduce((sum, s) => sum + s.length * 2, 0);
    while (bytes > this.maxBytes && this.past.length > 1) bytes -= this.past.shift()!.length * 2;
  }
  undo() {
    const source = this.past.pop();
    if (source === undefined) return null;
    this.future.push(this.current);
    this.current = source;
    this.boundary = true;
    return source;
  }
  redo() {
    const source = this.future.pop();
    if (source === undefined) return null;
    this.past.push(this.current);
    this.current = source;
    this.boundary = true;
    return source;
  }
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
}
