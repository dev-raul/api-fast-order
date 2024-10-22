import { Test } from '@nestjs/testing';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

import { makeFakeEmployee } from '@test/factories/employees.factory';

import { EmployeeMapper } from '../mappers/employee.mapper';
import { PrismaService } from '../prisma.service';
import { PrismaEmployeesRepository } from './prisma-employee-repository';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('PrismaEmployeesRepository', () => {
  let prismaService: PrismaService;
  let employeesRepository: EmployeesRepository;

  const employee = makeFakeEmployee({}, 1);
  const employeeToDomain = {
    id: 1,
    cpf: employee.cpf,
    name: employee.name,
    password: employee.password,
    created_at: employee.createdAt,
    updated_at: employee.createdAt,
    deleted: false,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: EmployeesRepository,
          useClass: PrismaEmployeesRepository,
        },
      ],
    }).compile();

    employeesRepository =
      moduleRef.get<EmployeesRepository>(EmployeesRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should create employee', async () => {
    jest
      .spyOn(prismaService.employee, 'create')
      .mockResolvedValue(employeeToDomain);
    const newEmployee = await employeesRepository.create(employee);

    expect(prismaService.employee.create).toHaveBeenCalledWith({
      data: EmployeeMapper.toPrisma(employee),
    });
    expect(newEmployee).toEqual(EmployeeMapper.toDomain(employeeToDomain));
  });

  it('should get employee by cpf', async () => {
    jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(null);
    expect(await employeesRepository.findByCpf(employee.cpf)).toBeNull();

    expect(prismaService.employee.findUnique).toHaveBeenCalledWith({
      where: {
        cpf: employee.cpf,
        deleted: false,
      },
    });

    jest
      .spyOn(prismaService.employee, 'findUnique')
      .mockResolvedValue(employeeToDomain);
    expect(await employeesRepository.findByCpf(employee.cpf)).toEqual(
      EmployeeMapper.toDomain(employeeToDomain),
    );
  });

  it('should get employee by id', async () => {
    jest.spyOn(prismaService.employee, 'findUnique').mockResolvedValue(null);
    expect(await employeesRepository.findById(employee.id)).toBeNull();

    expect(prismaService.employee.findUnique).toHaveBeenCalledWith({
      where: {
        id: employee.id,
      },
    });

    jest
      .spyOn(prismaService.employee, 'findUnique')
      .mockResolvedValue(employeeToDomain);
    expect(await employeesRepository.findById(employee.id)).toEqual(
      EmployeeMapper.toDomain(employeeToDomain),
    );
  });
});
