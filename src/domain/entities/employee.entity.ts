import { Entity } from '@core/domain/Entity';
import { Replace } from '@core/logic/Replace';

export type EmployeeProps = {
  name: string;
  cpf: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
  deleted?: boolean;
};

export class Employee extends Entity<EmployeeProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updateAt() {
    return this.props.updateAt;
  }

  get deleted() {
    return this.props.deleted;
  }

  static create(
    props: Replace<
      EmployeeProps,
      {
        createdAt?: Date;
        updateAt?: Date;
      }
    >,
    id?: number,
  ) {
    const employee = new Employee(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updateAt: props.updateAt ?? new Date(),
      },
      id,
    );

    return employee;
  }
}
