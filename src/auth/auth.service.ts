import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // 1. Logika untuk Register User baru
    async register(dto: RegisterDto) {
        // Cek apakah email sudah terdaftar di database
        const emailExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (emailExists) {
            throw new BadRequestException('Email sudah terdaftar');
        }

        // Mengamankan password dengan hashing bcrypt (tingkat keamanan salt 10)
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Simpan data user baru ke database PostgreSQL
        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            },
        });

        // Buat token akses untuk user baru tersebut
        const token = this.generateToken(newUser.id, newUser.email);

        return {
            accessToken: token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        };
    }

    // 2. Logika untuk Login User
    async login(dto: LoginDto) {
        // Cari user berdasarkan email di database
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // Bandingkan password input dengan password hash yang ada di DB
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // Buat token akses jika data valid
        const token = this.generateToken(user.id, user.email);

        return {
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    // Fungsi pembantu untuk membuat JWT Token
    private generateToken(userId: string, email: string): string {
        return this.jwtService.sign({ sub: userId, email });
    }
}