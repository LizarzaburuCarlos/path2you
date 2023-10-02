export const storeUser = (data) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      username: data.user.username,
      jwt: data.jwt,
    })
  );
};

export const userData = () => {
  const strUser = localStorage.getItem("user") || '""';
  return JSON.parse(strUser);
};

// export const Protector = () => {

//   useEffect(() => {
//     const { jwt } = userData();

//     if (!jwt) {
//       location.replace("/");
//     }
//   }, []);

// };