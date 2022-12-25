export const getAllUsers = async () => {
  const url = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  const response = await fetch(url, {
    method: "GET",
  });
  return await response.json();
};
