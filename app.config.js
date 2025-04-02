export default {
  expo: {
    name: 'Jgupuri',
    slug: 'temoapp',
    extra: {
      eas: {
        projectId: '51a236b6-f72e-46dc-81f0-fb8e7e599b8d',
      },
      API_URL:
        process.env.EXPO_PUBLIC_ENV === 'development'
          ? 'http://192.168.1.111:5000'
          : 'https://jgupuri-back.onrender.com',
    },
  },
}
