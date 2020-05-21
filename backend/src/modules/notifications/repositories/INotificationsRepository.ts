import ICreateNotitificationDTO from '../dtos/ICreateNotitificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotitificationDTO): Promise<Notification>;
}
