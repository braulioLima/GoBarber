import React from 'react';
import { FiLogIn } from 'react-icons/fi';

import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => {
  return (
    <Container>
      <Content>
        <img src="" alt="" />

        <form action="">
          <h1>Faça seu logon</h1>
          <input type="email" name="email" placeholder="E-mail" />
          <input
            type="password"
            name="senha"
            placeholder="Digite sua senha..."
          />
          <button type="submit">Entrar</button>
          <a href="s">Esqueci minha senha</a>
        </form>

        <a href="w">
          <FiLogIn />
          Criar conta
        </a>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
