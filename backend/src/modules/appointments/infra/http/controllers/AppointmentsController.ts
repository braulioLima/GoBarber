import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const { id: user_id } = request.user;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.run({
      provider_id,
      user_id,
      date,
    });

    return response.status(201).json(appointment);
  }
}

export default AppointmentsController;
