import { Injectable } from '@angular/core';
import { ISmokeHistory, SmokeSettings } from '../models/data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, mergeMap, take } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { IUser } from '../models/user.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService
  ) {}

  public user = () =>
    this.authService.user$.pipe(
      take(1),
      mergeMap((user) =>
        this.httpClient.get<IUser>(
          `https://${environment.authDomain}/api/v2/users/${encodeURI(
            user?.sub || ''
          )}`
        )
      )
    );

  public settings = () =>
    Object.freeze({
      read: () =>
        this.httpClient.get<SmokeSettings>(
          `${environment.apiBaseUri}/settings`
        ),
      update: (data: SmokeSettings) =>
        this.httpClient.put(`${environment.apiBaseUri}/settings`, data),
    });

  public history = <ID extends string | undefined | null | never = undefined>(
    id?: ID
  ): Readonly<RestApi<ID>> =>
    Object.freeze(
      id
        ? {
            read: () =>
              this.httpClient.get<ISmokeHistory>(
                `${environment.apiBaseUri}/history/${id}`
              ),
            update: (record: Omit<ISmokeHistory, 'id'>) =>
              this.httpClient.put(
                `${environment.apiBaseUri}/history/${id}`,
                record
              ),
            delete: () =>
              this.httpClient.delete(`${environment.apiBaseUri}/history/${id}`),
          }
        : {
            read: (params?: { date?: Date }) =>
              this.httpClient.get<ISmokeHistory[]>(
                `${environment.apiBaseUri}/history`,
                {
                  params: params?.date
                    ? {
                        ...params,
                        date: params.date.toJSON(),
                      }
                    : undefined,
                }
              ),
            create: (record: Omit<ISmokeHistory, 'id'>) =>
              this.httpClient.post<ISmokeHistory>(
                `${environment.apiBaseUri}/history`,
                record
              ),
          }
    ) as RestApi<ID>;
}

type RestApi<ID> = ID extends null | undefined | never
  ? {
      read(params?: { [key: string]: unknown }): Observable<ISmokeHistory[]>;
      create(record: Omit<ISmokeHistory, 'id'>): Observable<ISmokeHistory>;
      update?: never;
      delete?: never;
    }
  : {
      read(): Observable<ISmokeHistory>;
      update(record: Omit<ISmokeHistory, 'id'>): Observable<any>;
      delete(): Observable<any>;
      create?: never;
    };
