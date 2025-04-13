import { Expose } from 'class-transformer';
import { PageOptionsMetadataResponseBodyDto } from 'common/dtos/page-options-metadata-response-body.dto';

export abstract class PageOptionsResponseBodyDto {
  constructor(data: {
    metadata: ConstructorParameters<
      typeof PageOptionsMetadataResponseBodyDto
    >[0];
  }) {
    Object.assign(this, data);
    this.metadata = new PageOptionsMetadataResponseBodyDto(data.metadata);
  }

  @Expose()
  metadata: PageOptionsMetadataResponseBodyDto;
}
