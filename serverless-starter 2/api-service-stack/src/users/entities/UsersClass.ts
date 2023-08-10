export class UsersClass {
  readonly name: string;
  readonly phoneNumber: string;
  readonly email: string;

  constructor(name: string, phoneNumber: string, email: string) {
    this.checkValues(name);
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  private checkValues(name: string) {
    const newName = name.trim();
    if (newName.length < 3) {
      throw new Error("the name should be at least 3 charecters");
    }
  }
}
