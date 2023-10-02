import { useState } from "react";
import { logIn } from "../core/service";
import { storeUser } from "../core/helpers";

const initialUser = { identifier: "", password: "" };

const LoginForm = () => {
  const [user, setUser] = useState(initialUser);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    ) as any;

    try {
      if (!data.identifier || !data.password) {
        throw new Error("Por favor, ingresa todos los datos.");
      }

      const res = await logIn(data.identifier, data.password);

      if (res.jwt) {
        storeUser(res);
        setUser(initialUser);
        location.replace("/");
      }

      if (res.status === 400) {
        console.log("Revise la cuenta o credenciales");
      } else {
        console.log("Bienvenido");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="login w-full h-full bg-white text-white rounded-lg flex flex-col justify-center items-center">
      <div className="login__presentation w-fit flex flex-col gap-2 mx-auto text-center">
        <img
          src="/icono.png"
          alt="Logo Path2You"
          className="login__logo max-w-[5rem] mx-auto overflow-hidden"
        />
        <h1 className="login__title text-customPrimary text-3xl font-bold">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="login__text text-customText text-lg font-medium">
          Por favor, ingresa tus datos.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        autoComplete="on"
        className="form h-fit mt-16"
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
          name="identifier"
          id="identifier"
          className="form__input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          aria-label="Contraseña"
          name="password"
          id="password"
          className="form__input"
        />
        <div className="form__submit text-center mt-10">
          <button className="form__button button-primary mb-4">
            Iniciar Sesión
          </button>
          <p className="form__register-redirect text-customText font-medium">
            ¿No tienes una cuenta?
            <a
              className="ml-2 underline hover:opacity-80 transition-all duration-300"
              href="/"
              aria-label="Registrarse"
            >
              Regístrate
            </a>
          </p>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
