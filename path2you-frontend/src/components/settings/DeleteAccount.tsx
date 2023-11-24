import { useEffect, useState } from "react";
import type User from "../../interfaces/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchApi from "../../lib/strapi";

const DeleteAccount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserData(user);
    } else {
      console.error("No se encontró usuario.");
    }
  }, []);

  const deleteAccount = async () => {
    try {
      const res = await fetchApi({
        endpoint: `/users/${userData.id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.jwt}`,
        },
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleRedirect = async () => {
    setLoading(true);
    try {
      location.replace("/profile");
    } catch (error: any) {
      console.log(error);

      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteAccount();

      toast.success("Cuenta eliminada exitosamente");
      localStorage.setItem("user", "");

      setTimeout(() => {
        location.replace("/login");
      }, 2000);
    } catch (error: any) {
      console.log(error);

      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <section className="delete-account w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="delete-account__presentation">
        <h1 className="delete-account__title text-3xl font-bold mb-2">
          Eliminar Cuenta
        </h1>
        <p className="delete-account__text mb-4">
          Estás a punto de eliminar tu cuenta en nuestra plataforma. Queremos
          informarte sobre las consecuencias de esta acción:
        </p>
        <ol className="delete-account__list mb-4">
          <li className="delete-account__item mb-2">
            <span className="font-semibold">Pérdida de Acceso:</span> Una vez
            que elimines tu cuenta, perderás el acceso permanente a nuestra
            plataforma y a todos los recursos asociados.
          </li>
          <li className="delete-account__item mb-2">
            <span className="font-semibold">Cursos Inscritos:</span> La
            eliminación de tu cuenta resultará en la pérdida irreversible de
            todos los cursos en los que te hayas inscrito. No podrás acceder a
            los materiales del curso ni a ninguna información relacionada.
          </li>
          <li className="delete-account__item mb-2">
            <span className="font-semibold">Progreso y Calificación:</span> Todo
            el progreso, incluyendo módulos completados y calificaciones
            obtenidas en los cursos, se perderá por completo. Esta información
            no podrá ser recuperada después de la eliminación de la cuenta.
          </li>
          <li className="delete-account__item mb-2">
            <span className="font-semibold">Datos Personales:</span> La
            eliminación de tu cuenta eliminará todos los datos personales
            asociados a tu perfil, incluyendo información de contacto y
            preferencias de configuración.
          </li>
        </ol>
        <p className="delete-account__question text-center text-lg font-bold mt-2 mb-6">
          ¿Estás seguro de que deseas eliminar tu cuenta?
        </p>
      </div>
      <div className="delete-account__footer flex flex-col md:flex-row gap-6">
        <button
          type="submit"
          onClick={handleRedirect}
          className="form__submit button-secondary change mb-4 w-full md:w-1/2"
        >
          No, deseo mantener mi cuenta
        </button>
        <button
          type="submit"
          onClick={handleDelete}
          className="form__submit button-primary change mb-4 w-full md:w-1/2"
        >
          Sí, deseo eliminar mi cuenta
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default DeleteAccount;
