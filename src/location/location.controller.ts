import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common'

import { SessionRequired, SessionToken } from '../session/session.decorator'
import { APIResponse, badRequest, notFound, response } from '../util/http'
import { AutocompletePlace, LatLng, LocationService } from './location.service'
import { Place } from './place.entity'

@Controller('location')
@SessionRequired()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('latlng')
  @UseInterceptors(CacheInterceptor)
  async fromLatLng(@Query() { lat, lng }: LatLng): APIResponse<Place> {
    if (!lat || !lng) {
      throw badRequest('Both lat and lng are required')
    }

    return response(await this.locationService.decodeLatLng(lat, lng))
  }

  @Get('place/:id')
  async placeDetails(
    @Param('id') id: string,
    @SessionToken() token: string,
  ): APIResponse<Place> {
    const found = await this.locationService.placeDetails(id, token)
    if (found) return response(found)

    throw notFound(`Unable to find Place matching ${id}`)
  }

  @Get('search')
  async search(
    @Query('input') input: string,
    @SessionToken() token: string,
  ): APIResponse<AutocompletePlace[]> {
    if (!input) return response([], { message: 'Found no matches' })

    const result = await this.locationService.searchPlaces(input, token)
    return response(result)
  }
}
