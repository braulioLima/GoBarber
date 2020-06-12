import React, { useCallback, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import * as Yup from 'yup';

import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';

import { useAuth } from '../../hooks/AuthContext';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  BackButton,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { goBack } = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail é obrigatório'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().min(6, 'Deve ter um mínimo de 6 dígitos.'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('password', {
            is: val => !!val.length,
            then: Yup.string().min(6, 'Deve ter um mínimo de 6 dígitos.'),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const { data: userData } = await api.put('/profile', formData);

        updateUser(userData);

        Alert.alert('Perfil atualizado com sucesso!');

        goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [goBack, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    const options = {
      title: 'Selecione um avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galeria',
    };

    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        return;
      }

      if (response.error) {
        Alert.alert('Erro ao atualizar seu avatar.');
        return;
      }

      const data = new FormData();

      const formConfig = {
        type: 'image/jpg',
        name: `${user.id}.jpg`,
        uri: response.uri,
      };

      data.append('avatar', formConfig);

      const fetchData = async (): Promise<void> => {
        const apiUrl = '/users/avatar';
        const { data: apiResponseData } = await api.patch(apiUrl, data);

        updateUser(apiResponseData);
      };

      await fetchData();
    });
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar
                source={{
                  uri:
                    user.avatar_url ||
                    'https://api.adorable.io/avatars/200/abott@adorable.png',
                }}
              />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form initialData={user} onSubmit={handleProfile} ref={formRef}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
                placeholder="Nome"
                returnKeyType="next"
              />
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                icon="mail"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
                placeholder="E-mail"
                ref={emailInputRef}
                returnKeyType="next"
              />

              <Input
                name="old_password"
                icon="lock"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                placeholder="Senha atual"
                ref={oldPasswordInputRef}
                returnKeyType="next"
                secureTextEntry
                textContentType="newPassword"
              />

              <Input
                name="password"
                icon="lock"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                placeholder="Nova senha"
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry
                textContentType="newPassword"
              />

              <Input
                name="password_confirmation"
                icon="lock"
                onSubmitEditing={() => formRef.current?.submitForm()}
                placeholder="Confirmar Senha"
                ref={confirmPasswordInputRef}
                returnKeyType="send"
                secureTextEntry
                textContentType="newPassword"
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
