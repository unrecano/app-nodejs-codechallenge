import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

export class RetrieveTransactionQuery implements IQuery {
  constructor(readonly transactionId: string) {}
}

@QueryHandler(RetrieveTransactionQuery)
export class RetrieveTransactionQueryHandler
  implements IQueryHandler<RetrieveTransactionQuery>
{
  private readonly logger: Logger = new Logger(
    RetrieveTransactionQueryHandler.name,
  );

  constructor(
    @Inject('DocumentTransactionRepository')
    private readonly repository: TransactionRepository,
  ) {}

  async execute(query: RetrieveTransactionQuery): Promise<any> {
    const transaction = await this.repository.findTransaction(
      query.transactionId,
    );

    if (transaction.isErr()) {
      throw new InternalServerErrorException(
        transaction.error.message,
        transaction.error.name,
      );
    }

    this.logger.log(JSON.stringify(transaction.value));
    return transaction.value;
  }
}
