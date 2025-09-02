export class Permission {
  constructor(
    public id: string,
    public action: string, // format like "USER_CREATE", "USER_DELETE"
    public description?: string
  ) {}
}
