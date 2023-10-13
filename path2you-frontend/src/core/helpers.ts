export const storeUser = (data) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: data.user.id,
      username: data.user.username,
      darkmode: data.user.darkmode,
      neumorphismmode: data.user.neumorphismmode,
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