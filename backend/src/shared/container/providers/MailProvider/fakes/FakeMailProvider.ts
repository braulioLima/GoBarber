import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[];

  constructor() {
    this.messages = [];
  }

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default FakeMailProvider;
