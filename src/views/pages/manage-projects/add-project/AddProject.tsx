import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Select,
  Input,
  message,
  Row,
  Col,
} from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GlobalOutlined, LinkOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/context/AuthContext';
import apiServices from '@/api/apiServices';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Validation schema
const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Project name is required'),
  description: Yup.string().max(500, 'Description too long'),
  projectType: Yup.string().required('Project type is required'),
  //   websiteUrl: Yup.string()
  //     .url('Must be a valid URL')
  //     .when('projectType', {
  //       then: Yup.string().required('Website URL is required'),
  //       otherwise: Yup.string(),
  //     }),
  supportedLocales: Yup.array()
    .min(1, 'At least one language must be selected')
    .required('At least one language is required'),
});

const AddProject = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  // Project types from backend entity
  const projectTypes = [
    { value: 'website', label: 'Website' },
    { value: 'webapp', label: 'Web Application' },
    { value: 'mobile_app', label: 'Mobile App' },
    { value: 'desktop_app', label: 'Desktop Application' },
    { value: 'other', label: 'Other' },
  ];

  // Supported languages from backend enum
  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'fr-FR', label: 'French (France)' },
    { value: 'fr-CA', label: 'French (Canada)' },
    { value: 'es-ES', label: 'Spanish (Spain)' },
    { value: 'es-MX', label: 'Spanish (Mexico)' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'ja-JP', label: 'Japanese' },
  ];

  const handleSubmit = async (values, { resetForm }) => {
    console.log(user);

    if (!user || !user.company?.id) {
      message.error('No company associated with your account');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create project payload with company from user profile
      const projectData = {
        ...values,
        company: user.company.id,
      };

      // Call the API to create the project
      await apiServices.projects.create(projectData);

      message.success('Project created successfully');
      resetForm();
      navigate('/project-overview');
    } catch (error) {
      console.error('Error creating project:', error);
      message.error(
        error.response?.data?.message || 'Failed to create project'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <Title level={3}>Add New Project</Title>
        <Text className="block mb-2 text-gray-500">
          Create a new project to start managing your translations
        </Text>

        {user && user.company ? (
          <Text className="block mb-4 text-gray-600">
            Company: <strong>{user.company.name || user.company}</strong>
          </Text>
        ) : (
          <Text className="block mb-4 text-red-500">
            No company associated with your account. Please contact an
            administrator.
          </Text>
        )}

        <Formik
          initialValues={{
            name: '',
            description: '',
            projectType: 'website',
            websiteUrl: '',
            supportedLocales: ['en-US'], // Default to English
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-1 font-medium">
                      Project Name *
                    </label>
                    <Field
                      name="name"
                      as={Input}
                      placeholder="Enter project name"
                      className={`w-full ${errors.name && touched.name ? 'border-red-500' : ''}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block mb-1 font-medium"
                    >
                      Description
                    </label>
                    <Field
                      name="description"
                      as={TextArea}
                      rows={4}
                      placeholder="Brief description of your project"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="projectType"
                      className="block mb-1 font-medium"
                    >
                      Project Type *
                    </label>
                    <Select
                      id="projectType"
                      value={values.projectType}
                      onChange={(value) => setFieldValue('projectType', value)}
                      className="w-full"
                    >
                      {projectTypes.map((type) => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="projectType"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {values.projectType === 'website' && (
                    <div className="mb-4">
                      <label
                        htmlFor="websiteUrl"
                        className="block mb-1 font-medium"
                      >
                        Website URL *
                      </label>
                      <Field
                        name="websiteUrl"
                        as={Input}
                        prefix={<LinkOutlined />}
                        placeholder="https://example.com"
                        className={`w-full ${errors.websiteUrl && touched.websiteUrl ? 'border-red-500' : ''}`}
                      />
                      <ErrorMessage
                        name="websiteUrl"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  )}
                </Col>

                <Col xs={24} md={12}>
                  <div className="mb-4">
                    <label
                      htmlFor="supportedLocales"
                      className="block mb-1 font-medium"
                    >
                      Supported Languages *
                    </label>
                    <Select
                      id="supportedLocales"
                      mode="multiple"
                      value={values.supportedLocales}
                      onChange={(value) =>
                        setFieldValue('supportedLocales', value)
                      }
                      placeholder="Select languages"
                      className="w-full"
                    >
                      {languages.map((language) => (
                        <Option key={language.value} value={language.value}>
                          {language.label}
                        </Option>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="supportedLocales"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                    <Text className="block mt-2 text-xs text-gray-500">
                      These are the languages your project will support. You can
                      add more later.
                    </Text>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <div className="flex items-center mb-2">
                      <GlobalOutlined className="text-blue-500 mr-2" />
                      <Text strong>Default Source Language</Text>
                    </div>
                    <Text className="text-gray-600">
                      English (US) will be set as your default source language.
                      All translations will be based on this language.
                    </Text>
                  </div>
                </Col>
              </Row>

              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-4">
                <Button onClick={() => navigate(-1)}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  //   disabled={!user || !user.company}
                >
                  Create Project
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default AddProject;
