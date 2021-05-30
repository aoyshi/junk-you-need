import AuthForm from '../../components/common/auth-form';

export default () => {
  return <AuthForm requestUrl='/api/users/signup' formName='Sign Up' />;
};
