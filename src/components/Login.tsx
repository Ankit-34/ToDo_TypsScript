import Header from "./Header";
import '../Style/Form.css'
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import '../Style/login.css'

const Login = () => {

    type valuesType = {
        username : string,
        password : string
    }

    const navigate = useNavigate();
    const onFinish = (values : valuesType) => {
        const email : string = values.username;
        const password : string = values.password;
        if(email === "default@email.com" && password === "Default@2022")
        {
            localStorage.setItem("username", email);
            localStorage.setItem("password", password);
            localStorage.setItem("accessToken", "ankit.ganatra");
            navigate('/');
        }
        else{
            alert("Invalid credentials");
        }
    };

  return (
    <div>
        
        <Header />
      <Form
        className="form"
        name="basic"
        style={{ maxWidth: "600" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
          style={{
            width: "100%",
            alignItems: "center",
            margin: "20px auto",
          }}
        >
          <Input
            style={{
              width: "100%",
              padding: "5px",
            }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          style={{
            width: "100%",
            alignItems: "center",
            margin: "20px auto",
          }}
        >
          <Input.Password
            style={{
              width: "100%",
              padding: "5px",
            }}
          />
        </Form.Item>

        <Form.Item
          style={{
            width: "50%",
            margin: "10px auto",
            textAlign: "center",
          }}
        >
          <Button
            type="primary"
            style={{
              backgroundColor: "black",
              padding: "5px",
              height: "20%",
              width: "40%",
              margin: "0px auto",
              fontSize: "17px",
              letterSpacing: "1px",
            }}
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
