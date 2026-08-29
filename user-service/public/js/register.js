const form =
    document.getElementById(
        "registerForm"
    );


const message =
    document.getElementById(
        "message"
    );


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        message.textContent =
            "Creating account...";


        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name,

                                email,

                                password

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                if (data.errors) {

                    message.textContent =
                        data.errors
                            .map(
                                error =>
                                    error.msg
                            )
                            .join(", ");

                } else {

                    message.textContent =
                        data.message;

                }

                return;
            }


            message.textContent =
                "Registration successful!";


            form.reset();


            setTimeout(
                () => {

                    window.location.href =
                        "/login.html";

                },
                1500
            );


        } catch (error) {

            console.error(
                error
            );


            message.textContent =
                "Unable to connect to server";

        }

    }
);