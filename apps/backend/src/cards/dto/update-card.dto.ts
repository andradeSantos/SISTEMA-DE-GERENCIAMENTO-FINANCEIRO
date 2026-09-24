import { PartialType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto.js';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
