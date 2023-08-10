import { UsersRepo } from "../../repos/UsersRepo";
import { UsersMapper } from "../../../../src/users/mappers/UsersMapper";
import { UsersClass } from "../../../../src/users/entities/UsersClass";

export class GetUsers {
  readonly usersRepo: UsersRepo;
  readonly usersMapper: UsersMapper;

  constructor() {
    (this.usersMapper = new UsersMapper()), (this.usersRepo = new UsersRepo());
  }

  public getUsers = async () => {
    const myUsers: UsersClass[] | null = await this.usersRepo.getUsers();
    let myUsersToDto: { name: string; phoneNumber: string; email: string }[] =
      [];
    myUsers?.forEach((user) => myUsersToDto.push(this.usersMapper.toDto(user)));
    if (myUsersToDto.length != 0) {
      return myUsersToDto;
    }
    return null;
  };
}
