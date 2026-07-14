export const supportedLocales = ["vi", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "vi";

export const localeCookieName = "giltech-locale";

type MessageDictionary = {
  common: {
    dashboard: string;
    searchPlaceholder: string;
    foundationReady: string;
    currentContext: string;
    principal: string;
    whatIsLive: string;
    whatIsNext: string;
    state: string;
    next: string;
    openTemplateVault: string;
    archivedDemoRoutes: string;
    reusableFamilies: string;
    vaultPolicy: string;
    templateVault: string;
    legal: string;
    effectiveDate: string;
    owner: string;
    workspace: string;
    signInRequired: string;
    signIn: string;
    signOut: string;
    signUp: string;
    forgotPassword: string;
    resetPassword: string;
    noAccountYet: string;
    rememberMe: string;
    locale: string;
    localeVietnamese: string;
    localeEnglish: string;
    switchToVietnamese: string;
    switchToEnglish: string;
    closeMenu: string;
    toggleSidebar: string;
    notifications: string;
    items: string;
    lightMode: string;
    darkMode: string;
    switchThemeToLight: string;
    switchThemeToDark: string;
    profile: string;
    notSignedIn: string;
    hello: string;
    backToWorkspace: string;
  };
  nav: {
    sections: {
      overview: string;
      workspace: string;
      audience: string;
      operations: string;
      reports: string;
      experience: string;
      engagement: string;
      access: string;
      system: string;
      legal: string;
      authentication: string;
    };
    items: {
      dashboard: string;
      workspace: string;
      clientWorkspace: string;
      audience: string;
      checkinRuntime: string;
      offlineSync: string;
      reports: string;
      experience: string;
      engagement: string;
      rbac: string;
      authentication: string;
      signIn: string;
      signUp: string;
      forgotPassword: string;
      resetPassword: string;
      system: string;
      templateVault: string;
      termsOfUse: string;
      privacyPolicy: string;
      refundPolicy: string;
    };
  };
  header: {
    sections: {
      workspace: string;
      audience: string;
      operations: string;
      reports: string;
      experience: string;
      engagement: string;
      system: string;
      rbac: string;
      authentication: string;
      legal: string;
      archived: string;
      foundation: string;
    };
    foundationBanner: string;
  };
  footer: {
    productName: string;
    copyright: string;
    builtOn: string;
    rbac: string;
    terms: string;
    privacy: string;
    refunds: string;
  };
  auth: {
    signInTitle: string;
    signInEyebrow: string;
    welcomeBack: string;
    signInPrompt: string;
    signInInstructions: string;
    signInWithEmail: string;
    noAccountPrompt: string;
    fullName: string;
    companyName: string;
    createAccount: string;
    signUpEyebrow: string;
    createAccountPrompt: string;
    signUpInstructions: string;
    accountCreated: string;
    forgotEyebrow: string;
    forgotTitle: string;
    forgotInstructions: string;
    sendResetLink: string;
    resetEyebrow: string;
    resetTitle: string;
    resetInstructions: string;
    preparingRecovery: string;
    newPassword: string;
    confirmNewPassword: string;
    updatePassword: string;
    passwordMismatch: string;
    passwordResetEmailSent: string;
    passwordUpdated: string;
    confirmSignUpLink: string;
    googleSignIn: string;
    signInWithGoogle: string;
    email: string;
    password: string;
    enterEmail: string;
    enterPassword: string;
    createPassword: string;
    confirmPassword: string;
    recoverAccess: string;
    completeRecovery: string;
    signInSuccessSuffix: string;
  };
  notifications: {
    title: string;
    itemsLabel: string;
    rbacSeedVerified: string;
    rbacSeedVerifiedDetail: string;
    rlsBaselineActive: string;
    rlsBaselineActiveDetail: string;
    shellRewriteInPlace: string;
    shellRewriteInPlaceDetail: string;
    legalPagesReady: string;
    legalPagesReadyDetail: string;
    nextPhaseQueued: string;
    nextPhaseQueuedDetail: string;
    openRbacConsole: string;
  };
  templateVault: {
    eyebrow: string;
    retained: string;
    hiddenFromNav: string;
    reuseStorage: string;
    title: string;
    summary: string;
    vaultPolicy: string;
    vaultPolicyBullets: readonly string[];
    preservationNote: string;
    archivedDemoRoutesTitle: string;
    archivedDemoRoutesDescription: string;
    reusableFamiliesTitle: string;
    reusableFamiliesDescription: string;
    preservedNote: string;
  };
  legal: {
    title: string;
    effectiveDate: string;
    owner: string;
  };
  moduleLanding: {
    currentContext: string;
    principal: string;
    whatIsLive: string;
    whatIsNext: string;
    liveSectionDescription: string;
    nextSectionDescription: string;
    liveState: string;
    nextState: string;
    archivedNote: string;
    liveReadyNote: string;
  };
};

export const messages: Record<Locale, MessageDictionary> = {
  vi: {
    common: {
      dashboard: "Bảng điều khiển",
      searchPlaceholder: "Tìm người dùng, công ty, vai trò",
      foundationReady: "Nền tảng sẵn sàng",
      currentContext: "Ngữ cảnh hiện tại",
      principal: "Chủ thể",
      whatIsLive: "Đang hoạt động",
      whatIsNext: "Sắp triển khai",
      state: "trạng thái",
      next: "tiếp theo",
      openTemplateVault: "Mở kho template",
      archivedDemoRoutes: "Các route demo đã lưu trữ",
      reusableFamilies: "Nhóm component tái sử dụng",
      vaultPolicy: "Chính sách kho lưu trữ",
      templateVault: "Kho template",
      legal: "Pháp lý",
      effectiveDate: "Ngày hiệu lực",
      owner: "Chủ sở hữu",
      workspace: "Không gian làm việc",
      signInRequired: "Bắt buộc đăng nhập",
      signIn: "Đăng nhập",
      signOut: "Đăng xuất",
      signUp: "Đăng ký",
      forgotPassword: "Quên mật khẩu",
      resetPassword: "Đặt lại mật khẩu",
      noAccountYet: "Chưa có tài khoản?",
      rememberMe: "Ghi nhớ tôi",
      locale: "Ngôn ngữ",
      localeVietnamese: "Tiếng Việt",
      localeEnglish: "English",
      switchToVietnamese: "Chuyển sang tiếng Việt",
      switchToEnglish: "Switch to English",
      closeMenu: "Đóng menu",
      toggleSidebar: "Bật/tắt thanh bên",
      notifications: "Thông báo",
      items: "mục",
      lightMode: "Chế độ sáng",
      darkMode: "Chế độ tối",
      switchThemeToLight: "Chuyển sang chế độ sáng",
      switchThemeToDark: "Chuyển sang chế độ tối",
      profile: "Hồ sơ",
      notSignedIn: "Chưa đăng nhập",
      hello: "Xin chào",
      backToWorkspace: "Quay lại không gian làm việc",
    },
    nav: {
      sections: {
        overview: "TỔNG QUAN",
        workspace: "KHÔNG GIAN LÀM VIỆC",
        audience: "KHÁCH THAM DỰ",
        operations: "VẬN HÀNH",
        reports: "BÁO CÁO",
        experience: "TRẢI NGHIỆM",
        engagement: "TƯƠNG TÁC",
        access: "TRUY CẬP",
        system: "HỆ THỐNG",
        legal: "PHÁP LÝ",
        authentication: "XÁC THỰC",
      },
      items: {
        dashboard: "Bảng điều khiển",
        workspace: "Workspace",
        clientWorkspace: "Workspace khách hàng",
        audience: "Khách tham dự",
        checkinRuntime: "Runtime check-in",
        offlineSync: "Đồng bộ ngoại tuyến",
        reports: "Báo cáo",
        experience: "Trải nghiệm",
        engagement: "Tương tác",
        rbac: "RBAC",
        authentication: "Xác thực",
        signIn: "Đăng nhập",
        signUp: "Đăng ký",
        forgotPassword: "Quên mật khẩu",
        resetPassword: "Đặt lại mật khẩu",
        system: "Hệ thống",
        templateVault: "Kho template",
        termsOfUse: "Điều khoản sử dụng",
        privacyPolicy: "Chính sách quyền riêng tư",
        refundPolicy: "Chính sách hoàn tiền",
      },
    },
    header: {
      sections: {
        workspace: "Không gian làm việc",
        audience: "Khách tham dự",
        operations: "Vận hành",
        reports: "Báo cáo",
        experience: "Trải nghiệm",
        engagement: "Tương tác",
        system: "Hệ thống",
        rbac: "RBAC",
        authentication: "Xác thực",
        legal: "Pháp lý",
        archived: "Lưu trữ",
        foundation: "Nền tảng",
      },
      foundationBanner: "Nền tảng sẵn sàng",
    },
    footer: {
      productName: "Giltech Solutions Check-in",
      copyright: "© {year} Giltech Solutions.",
      builtOn: "Xây dựng trên Next.js và Supabase PostgreSQL.",
      rbac: "RBAC",
      terms: "Điều khoản",
      privacy: "Quyền riêng tư",
      refunds: "Hoàn tiền",
    },
    auth: {
      signInTitle: "Đăng nhập",
      signInEyebrow: "Đăng nhập vào tài khoản của bạn",
      welcomeBack: "Chào mừng trở lại",
      signInPrompt: "Vui lòng đăng nhập để tiếp tục",
      signInInstructions: "Hoàn tất các trường bên dưới để vào hệ thống.",
      signInWithEmail: "Hoặc đăng nhập bằng email",
      noAccountPrompt: "Chưa có tài khoản?",
      fullName: "Họ và tên",
      companyName: "Tên công ty",
      createAccount: "Tạo tài khoản",
      signUpEyebrow: "Tạo tài khoản mới",
      createAccountPrompt: "Thiết lập tài khoản Giltech của bạn",
      signUpInstructions:
        "Điền thông tin bên dưới để khởi tạo tài khoản và không gian công ty.",
      accountCreated:
        "Tài khoản đã được tạo. Hãy kiểm tra email để xác nhận trước khi đăng nhập.",
      forgotEyebrow: "Khôi phục quyền truy cập",
      forgotTitle: "Đặt lại mật khẩu",
      forgotInstructions:
        "Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn để bạn cập nhật thông tin đăng nhập an toàn.",
      sendResetLink: "Gửi liên kết đặt lại",
      resetEyebrow: "Hoàn tất khôi phục",
      resetTitle: "Chọn mật khẩu mới",
      resetInstructions:
        "Sau khi liên kết khôi phục được xác thực, bạn có thể đặt mật khẩu mới và quay lại trang đăng nhập.",
      preparingRecovery: "Đang chuẩn bị phiên khôi phục...",
      newPassword: "Mật khẩu mới",
      confirmNewPassword: "Xác nhận mật khẩu mới",
      updatePassword: "Cập nhật mật khẩu",
      passwordMismatch: "Mật khẩu không khớp.",
      passwordResetEmailSent:
        "Đã gửi email đặt lại mật khẩu. Hãy mở hộp thư để nhận liên kết.",
      passwordUpdated: "Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập.",
      confirmSignUpLink:
        "Tài khoản đã được tạo. Hãy kiểm tra email để xác nhận đăng ký trước khi đăng nhập.",
      googleSignIn: "Đăng nhập",
      signInWithGoogle: "Đăng nhập bằng Google",
      email: "Email",
      password: "Mật khẩu",
      enterEmail: "Nhập email của bạn",
      enterPassword: "Nhập mật khẩu của bạn",
      createPassword: "Tạo mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      recoverAccess: "Khôi phục quyền truy cập",
      completeRecovery: "Hoàn tất khôi phục",
      signInSuccessSuffix: "đăng nhập thành công.",
    },
    notifications: {
      title: "Cảnh báo nền tảng",
      itemsLabel: "5 mục",
      rbacSeedVerified: "RBAC seed đã được xác minh",
      rbacSeedVerifiedDetail: "5 người dùng demo đã được map vào auth.users",
      rlsBaselineActive: "RLS baseline đang hoạt động",
      rlsBaselineActiveDetail:
        "Các bảng tenant đã được bảo vệ bằng kiểm tra phía server",
      shellRewriteInPlace: "Shell rewrite đã sẵn sàng",
      shellRewriteInPlaceDetail:
        "Dashboard gốc đã chuyển sang shell nền tảng Giltech",
      legalPagesReady: "Trang pháp lý đã sẵn sàng",
      legalPagesReadyDetail:
        "Điều khoản, quyền riêng tư và hoàn tiền đã được kích hoạt",
      nextPhaseQueued: "Pha tiếp theo đã xếp hàng",
      nextPhaseQueuedDetail:
        "Parity client, check-in, report, print và campaign vẫn đang chờ",
      openRbacConsole: "Mở bảng RBAC",
    },
    templateVault: {
      eyebrow: "Kho lưu trữ tái sử dụng",
      retained: "được giữ lại",
      hiddenFromNav: "ẩn khỏi menu chính",
      reuseStorage: "Kho tái sử dụng",
      title:
        "Các route demo và component template vẫn được giữ để tái sử dụng",
      summary:
        "Các màn hình demo gốc được giữ nguyên trong repo như một kho lưu trữ. Chúng không còn nằm trong điều hướng chính, nhưng vẫn dễ tìm để đội ngũ tái dùng card, layout, form, table, chart và UI primitive sau này.",
      vaultPolicy: "Chính sách kho lưu trữ",
      vaultPolicyBullets: [
        "Không đưa các route template vào điều hướng chính của shell.",
        "Giữ nguyên các component và page block có thể tái sử dụng trong thư mục hiện tại.",
        "Ưu tiên tái dùng pattern hiện có trước khi viết component mới.",
        "Chỉ lưu trữ, không xóa, cho đến khi module thay thế đã ổn định hoàn toàn.",
      ],
      preservationNote:
        "Điều này giữ app gọn cho người dùng nhưng vẫn bảo toàn thư viện template cho lần tái sử dụng tiếp theo.",
      archivedDemoRoutesTitle: "Các route demo đã lưu trữ",
      archivedDemoRoutesDescription:
        "Các route group này không còn xuất hiện trong shell chính, nhưng vẫn có thể mở ở đây để tái dùng và đối chiếu.",
      reusableFamiliesTitle: "Các nhóm component tái sử dụng",
      reusableFamiliesDescription:
        "Các nhóm này là nguyên liệu để các module viết lại có thể dựa vào thay vì dựng lại từ đầu.",
      preservedNote:
        "Không có gì bị xóa ở đây. Kho này là vùng giữ tạm cho thư viện demo trong lúc sản phẩm được viết lại.",
    },
    legal: {
      title: "Pháp lý",
      effectiveDate: "Ngày hiệu lực",
      owner: "Chủ sở hữu",
    },
    moduleLanding: {
      currentContext: "Ngữ cảnh hiện tại",
      principal: "Chủ thể",
      whatIsLive: "Đang hoạt động",
      whatIsNext: "Sắp triển khai",
      liveSectionDescription:
        "Các thẻ này mô tả trạng thái shell hiện tại và dữ liệu đã được nối vào.",
      nextSectionDescription:
        "Đây là các mục tiêu tái viết nằm phía sau shell và nên được triển khai dần.",
      liveState: "trạng thái",
      nextState: "tiếp theo",
      archivedNote: "Mở kho template",
      liveReadyNote:
        "RBAC, session và seed data đã sẵn sàng. Shell này đã có thể nhận rewrite theo module.",
    },
  },
  en: {
    common: {
      dashboard: "Dashboard",
      searchPlaceholder: "Search users, companies, roles",
      foundationReady: "Foundation ready",
      currentContext: "Current context",
      principal: "Principal",
      whatIsLive: "What is live",
      whatIsNext: "What is next",
      state: "state",
      next: "next",
      openTemplateVault: "Open template vault",
      archivedDemoRoutes: "Archived demo routes",
      reusableFamilies: "Reusable component families",
      vaultPolicy: "Vault policy",
      templateVault: "Template vault",
      legal: "Legal",
      effectiveDate: "Effective date",
      owner: "Owner",
      workspace: "Workspace",
      signInRequired: "Sign-in required",
      signIn: "Sign in",
      signOut: "Sign out",
      signUp: "Sign up",
      forgotPassword: "Forgot password",
      resetPassword: "Reset password",
      noAccountYet: "Don't have an account yet?",
      rememberMe: "Remember me",
      locale: "Language",
      localeVietnamese: "Tiếng Việt",
      localeEnglish: "English",
      switchToVietnamese: "Chuyển sang tiếng Việt",
      switchToEnglish: "Switch to English",
      closeMenu: "Close menu",
      toggleSidebar: "Toggle sidebar",
      notifications: "Notifications",
      items: "items",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      switchThemeToLight: "Switch to light mode",
      switchThemeToDark: "Switch to dark mode",
      profile: "Profile",
      notSignedIn: "Not signed in",
      hello: "Hello",
      backToWorkspace: "Back to workspace",
    },
    nav: {
      sections: {
        overview: "OVERVIEW",
        workspace: "WORKSPACE",
        audience: "AUDIENCE",
        operations: "OPERATIONS",
        reports: "REPORTS",
        experience: "EXPERIENCE",
        engagement: "ENGAGEMENT",
        access: "ACCESS",
        system: "SYSTEM",
        legal: "LEGAL",
        authentication: "AUTHENTICATION",
      },
      items: {
        dashboard: "Dashboard",
        workspace: "Workspace",
        clientWorkspace: "Client workspace",
        audience: "Audience",
        checkinRuntime: "Check-in runtime",
        offlineSync: "Offline sync",
        reports: "Reports",
        experience: "Experience",
        engagement: "Engagement",
        rbac: "RBAC",
        authentication: "Authentication",
        signIn: "Sign in",
        signUp: "Sign up",
        forgotPassword: "Forgot password",
        resetPassword: "Reset password",
        system: "System",
        templateVault: "Template vault",
        termsOfUse: "Terms of use",
        privacyPolicy: "Privacy policy",
        refundPolicy: "Refund policy",
      },
    },
    header: {
      sections: {
        workspace: "Workspace",
        audience: "Audience",
        operations: "Operations",
        reports: "Reports",
        experience: "Experience",
        engagement: "Engagement",
        system: "System",
        rbac: "RBAC",
        authentication: "Authentication",
        legal: "Legal",
        archived: "Archived",
        foundation: "Foundation",
      },
      foundationBanner: "Foundation ready",
    },
    footer: {
      productName: "Giltech Solutions Check-in",
      copyright: "© {year} Giltech Solutions.",
      builtOn: "Built on Next.js and Supabase PostgreSQL.",
      rbac: "RBAC",
      terms: "Terms",
      privacy: "Privacy",
      refunds: "Refunds",
    },
    auth: {
      signInTitle: "Sign in",
      signInEyebrow: "Sign in to your account",
      welcomeBack: "Welcome back",
      signInPrompt: "Please sign in to continue",
      signInInstructions: "Complete the fields below to enter the system.",
      signInWithEmail: "Or sign in with email",
      noAccountPrompt: "Don't have an account yet?",
      fullName: "Full name",
      companyName: "Company name",
      createAccount: "Create account",
      signUpEyebrow: "Create a new account",
      createAccountPrompt: "Set up your Giltech account",
      signUpInstructions:
        "Fill in the details below to create your account and company workspace.",
      accountCreated:
        "Account created. Check your email to confirm before signing in.",
      forgotEyebrow: "Recover access",
      forgotTitle: "Reset your password",
      forgotInstructions:
        "We will send a password reset link to your email so you can update your credentials securely.",
      sendResetLink: "Send reset link",
      resetEyebrow: "Complete recovery",
      resetTitle: "Choose a new password",
      resetInstructions:
        "Once your recovery link is validated, you can immediately set a new password and return to the sign-in page.",
      preparingRecovery: "Preparing your recovery session...",
      newPassword: "New password",
      confirmNewPassword: "Confirm new password",
      updatePassword: "Update password",
      passwordMismatch: "Passwords do not match.",
      passwordResetEmailSent:
        "Password reset email sent. Follow the link in your inbox to choose a new password.",
      passwordUpdated: "Password updated. Redirecting to sign in.",
      confirmSignUpLink:
        "Account created. Check your email to confirm the sign-up link before logging in.",
      googleSignIn: "Sign in",
      signInWithGoogle: "Sign in with Google",
      email: "Email",
      password: "Password",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      createPassword: "Create a password",
      confirmPassword: "Confirm your password",
      recoverAccess: "Recover access",
      completeRecovery: "Complete recovery",
      signInSuccessSuffix: "signed in successfully.",
    },
    notifications: {
      title: "Foundation alerts",
      itemsLabel: "5 items",
      rbacSeedVerified: "RBAC seed verified",
      rbacSeedVerifiedDetail: "5 demo users are mapped to auth.users",
      rlsBaselineActive: "RLS baseline active",
      rlsBaselineActiveDetail:
        "Tenant tables are protected by service-side checks",
      shellRewriteInPlace: "Shell rewrite in place",
      shellRewriteInPlaceDetail:
        "Root dashboard now points to the Giltech foundation shell",
      legalPagesReady: "Legal pages ready",
      legalPagesReadyDetail: "Terms, privacy, and refund policy are live",
      nextPhaseQueued: "Next phase queued",
      nextPhaseQueuedDetail:
        "Client, check-in, report, print, and campaign parity remain",
      openRbacConsole: "Open RBAC console",
    },
    templateVault: {
      eyebrow: "Reuse storage",
      retained: "retained",
      hiddenFromNav: "hidden from primary nav",
      reuseStorage: "Reuse storage",
      title:
        "Demo routes and template components stay available for reuse instead of being rewritten from scratch.",
      summary:
        "The original demo surfaces are intentionally kept in the repo as a vault. They are no longer part of the main navigation, but the page keeps them discoverable so the team can reuse cards, layouts, forms, tables, charts, and UI primitives later.",
      vaultPolicy: "Vault policy",
      vaultPolicyBullets: [
        "Keep template routes out of the primary shell navigation.",
        "Preserve reusable components and page blocks in their current folders.",
        "Reuse existing patterns before writing a new component.",
        "Archive, do not delete, until the replacement module is fully stable.",
      ],
      preservationNote:
        "This keeps the app lean for users while preserving the template library for future reuse.",
      archivedDemoRoutesTitle: "Archived demo routes",
      archivedDemoRoutesDescription:
        "These route groups are no longer exposed in the primary shell, but they remain accessible here for reuse and comparison.",
      reusableFamiliesTitle: "Reusable component families",
      reusableFamiliesDescription:
        "These families are the source material the next module rewrites can lean on instead of rebuilding every pattern.",
      preservedNote:
        "Nothing is deleted here. The vault is the holding area for the demo library while the product shell rewrites continue.",
    },
    legal: {
      title: "Legal",
      effectiveDate: "Effective date",
      owner: "Owner",
    },
    moduleLanding: {
      currentContext: "Current context",
      principal: "Principal",
      whatIsLive: "What is live",
      whatIsNext: "What is next",
      liveSectionDescription:
        "These cards describe the current shell state and the data already wired in.",
      nextSectionDescription:
        "These are the rewrite targets that sit behind the shell and should be implemented progressively.",
      liveState: "state",
      nextState: "next",
      archivedNote: "Open template vault",
      liveReadyNote:
        "RBAC, session, and seed data are already live. This shell is ready for module-level rewrite.",
    },
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "vi" || value === "en";
}

export function getMessages(locale: Locale) {
  return messages[locale];
}
