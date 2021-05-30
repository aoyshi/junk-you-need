import AuthForm from '../../components/common/auth-form';

export default () => {
  return <AuthForm requestUrl='/api/users/signin' formName='Sign In' />;
};
