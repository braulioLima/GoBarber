import React, { useCallback, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, AnimationContainer, Background } from './styles';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string()
            .required('Senha é obrigatória')
            .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senha devem ser iguais.',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha.',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Resetar senha</h1>
            <Input
              type="password"
              name="password"
              placeholder="Nova senha..."
              icon={FiLock}
            />

            <Input
              type="password"
              name="password_confirmation"
              placeholder="Confirmação da senha..."
              icon={FiLock}
            />
            <Button type="submit">Alterar senha</Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar para o login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
