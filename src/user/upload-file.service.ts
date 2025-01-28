import { Injectable, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }

    const fileKey = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(params));
    const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Зберігаємо URL фото в базі
    user.photo = fileUrl;
    await this.userRepository.save(user);

    return fileUrl;
  }

  async removePhoto(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.photo) {
      throw new NotFoundException('Фото не знайдено');
    }

    // Видаляємо фото з S3
    const fileKey = user.photo.split('/').pop(); // Отримуємо ім'я файлу
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    await this.s3Client.send(new DeleteObjectCommand(params));

    // Видаляємо посилання з бази
    user.photo = null;
    await this.userRepository.save(user);
  }
}
