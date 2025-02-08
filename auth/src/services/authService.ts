export async function signUp(user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNo: string;
  currency: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    }

    return {
      success: false,
      message: data.message || "Something went wrong!",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}

export async function signIn(user: { email: string; password: string }) {
  try {
    const response = await fetch("/api/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    }

    return {
      success: false,
      message: data.message || "Something went wrong!"
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}

export async function checkAuth() {
  try {
    const response = await fetch("/api/verify-token", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
        userData: data.userData,
      };
    }

    return {
      success: false,
      message: data.message || "Something went wrong!",
      userData: null,
    };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong!",
      userData: null,
    };
  }
}
