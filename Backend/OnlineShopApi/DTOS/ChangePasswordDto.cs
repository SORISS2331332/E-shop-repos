﻿namespace OnlineShopApi.DTOS
{
    public class ChangePasswordDto
    {
        public string? userId { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? ConfirmNewPassword { get; set; }
    }

}
