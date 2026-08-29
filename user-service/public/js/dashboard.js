const token =
    localStorage.getItem(
        "token"
    );


const welcome =
    document.getElementById(
        "welcome"
    );


const profile =
    document.getElementById(
        "profile"
    );


// ==========================================
// CHECK AUTHENTICATION
// ==========================================

if (!token) {

    window.location.href =
        "/login.html";

}


// ==========================================
// GET PROFILE
// ==========================================

async function getProfile() {

    try {

        const response =
            await fetch(
                "/api/auth/profile",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "/login.html";

            return;
        }


        welcome.textContent =
            `Welcome, ${data.user.name}!`;


        profile.innerHTML = `

            <div class="profile">

                <p>
                    <strong>User ID:</strong>
                    ${data.user.id}
                </p>

                <p>
                    <strong>Name:</strong>
                    ${data.user.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${data.user.email}
                </p>

                <p>
                    <strong>Created:</strong>
                    ${new Date(
                        data.user.created_at
                    ).toLocaleString()}
                </p>

            </div>

        `;


    } catch (error) {

        console.error(
            error
        );


        profile.textContent =
            "Unable to load profile";

    }

}


getProfile();


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logout")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "/login.html";

        }
    );