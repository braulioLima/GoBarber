import {
  getHours,
  getDate,
  getDaysInMonth,
  setHours,
  setMonth,
  getMonth,
  getYear,
} from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list appointments in day', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 5, 8, 8, 0, 0),
    });

    const test = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 5, 8, 9, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 5, 8, 7, 0, 0).getTime();
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 6,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 1, available: false },
        { day: 8, available: true },
        { day: 21, available: true },
      ]),
    );
  });

  it('should be able to list past days in current month with false', async () => {
    const hourNow = getHours(Date.now()) - 3;
    const today = setHours(new Date(Date.now()), hourNow);
    const day = getDate(today);

    // console.log(today);
    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 1, available: false },
        { day: 15, available: false },
        { day: 21, available: false },
      ]),
    );
  });

  it('should be able to list all days in the month with available false if year or month in the past', async () => {
    // Test past month
    let numberOfDaysInMonth = getDaysInMonth(new Date(2020, 3));
    let availabilityResponse = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => ({ day: index + 1, available: false }),
    );

    let availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 4,
    });

    expect(availability).toEqual(availabilityResponse);

    //  Test past year
    numberOfDaysInMonth = getDaysInMonth(new Date(2019, 3));
    availabilityResponse = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => ({ day: index + 1, available: false }),
    );

    availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2019,
      month: 4,
    });

    expect(availability).toEqual(availabilityResponse);
  });
});
