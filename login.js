function togglePassword() {
    var passwordInput = $("#password");
    var toggleIcon = $("#toggle-password i");

    if (passwordInput.attr("type") === "password") {
    passwordInput.attr("type", "text");
    toggleIcon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
    passwordInput.attr("type", "password");
    toggleIcon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
}
