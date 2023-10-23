import { useQuery } from "react-query";
import { Card, CardHeader, CardContent } from "@mui/material";
import "../App.css";
const ReactQueryExample = () => {
  // useQuery returns 3 items, key name is a label for the query
  const { isLoading, error, data } = useQuery("querykeyname", async () => {
    let response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ query: "query { users{name,age,email} }" }),
    });
    return await response.json();
  });
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  return (
    <Card className="card">
      <CardHeader title="React Query Example" />
      <CardContent>
        {
          /* first data is react query from above, 2nd data is from graphql */
          data.data.users.map((user, index) => {
            return <div key={index}>{user.name}</div>;
          })
        }
      </CardContent>
    </Card>
  );
};
export default ReactQueryExample;
