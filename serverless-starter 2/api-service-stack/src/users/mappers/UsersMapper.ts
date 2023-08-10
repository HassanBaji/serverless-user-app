import { UsersClass } from "../entities/UsersClass";

export interface toDomainProps {
  email: string;
  name: string;
  phoneNumber: string;
}

export class UsersMapper {
  public toDomain = (raw: toDomainProps) => {
    return new UsersClass(raw.name, raw.phoneNumber, raw.email);
  };

  public toDto = (user: UsersClass, pic?: any) => {
    return {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePic: pic,
    };
  };

  public toPersistent = (user: UsersClass) => {
    return {
      pk: "user",
      sk: user.email,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  };
}
