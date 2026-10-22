import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
  ) {
    try {
      console.log(
        'ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â§ Mengirim reset password ke:',
        email,
      );

      console.log(
        'ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ Reset URL:',
        resetUrl,
      );

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject:
          'Reset Password Admin - Kecamatan Candisari',
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              line-height: 1.6;
            "
          >
            <h2>Reset Password</h2>

            <p>Halo,</p>

            <p>
              Kami menerima permintaan untuk mereset
              password akun administrator Kecamatan
              Candisari.
            </p>

            <p>
              Klik tombol berikut untuk membuat
              password baru:
            </p>

            <p>
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background: #7f1d1d;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                "
              >
                Reset Password
              </a>
            </p>

            <p>
              Link ini berlaku selama
              <strong>60 menit</strong>.
            </p>

            <p>
              Jika Anda tidak meminta reset password,
              abaikan email ini.
            </p>

            <p>
              Salam,<br>
              Sistem Administrasi Kecamatan Candisari
            </p>
          </div>
        `,
      });

      console.log('ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Email berhasil dikirim');
      console.log(
        'ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¨ Message ID:',
        info.messageId,
      );
    } catch (error) {
      console.error(
        'ÃƒÂ¢Ã‚ÂÃ…â€™ Gagal mengirim email reset password:',
        error,
      );

      throw new InternalServerErrorException(
        'Gagal mengirim email reset password',
      );
    }
  }


  async sendAdminInvitationEmail(
    name: string,
    email: string,
    inviteUrl: string,
    isResend = false,
  ) {
    const safeName = name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const safeUrl = inviteUrl
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: isResend ? 'Undangan Ulang Admin - Kecamatan Candisari' : 'Undangan Admin - Kecamatan Candisari',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Undangan Administrator</h2>
            <p>Halo ${safeName},</p>
            <p>Anda diundang untuk menjadi pengelola website Kecamatan Candisari.</p>
            <p>Klik tombol berikut untuk membuat password akun Anda:</p>
            <p>
              <a href="${safeUrl}"
                 style="display:inline-block;padding:12px 20px;background:#7f1d1d;color:#fff;text-decoration:none;border-radius:6px;">
                Buat Password
              </a>
            </p>
            <p>Tautan ini berlaku selama <strong>60 menit</strong> dan hanya dapat digunakan satu kali.</p>
            <p>Jika Anda tidak mengharapkan undangan ini, abaikan email ini.</p>
            <p>Salam,<br>Sistem Administrasi Kecamatan Candisari</p>
          </div>
        `,
      });
    } catch (error: any) {
      console.error('Gagal mengirim email undangan admin:', {
        name: error?.name,
        code: error?.code,
        command: error?.command,
        responseCode: error?.responseCode,
        response: typeof error?.response === 'string'
          ? error.response
          : undefined,
        message: error?.message,
      });

      throw new InternalServerErrorException(
        'Gagal mengirim email undangan admin',
      );
    }
  }
}