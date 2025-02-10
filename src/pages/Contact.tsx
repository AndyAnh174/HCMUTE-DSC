import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Select, message } from 'antd';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
} from '../utils/icons';
import Section from '../components/ui/Section';
import axiosInstance from '../utils/axios';

const { TextArea } = Input;
const { Option } = Select;

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      console.log('Sending data:', values);
      
      const response = await axiosInstance.post('/contacts', values);
      console.log('Response:', response);
      
      if (response.status === 201) {
        message.success('Đã gửi tin nhắn thành công!');
        form.resetFields();
      }
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else if (error.code === 'ERR_NETWORK') {
        message.error('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } else {
        message.error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section 
        className="pt-24 pb-12"
        gradient="primary"
        pattern="dots"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Liên Hệ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào. 
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
          </p>
        </motion.div>
      </Section>

      {/* Contact Form Section */}
      <Section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Thông Tin Liên Hệ</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <IconWrapper>
                    <IconMapPin className="text-primary mt-1" />
                  </IconWrapper>
                  <div>
                    <h3 className="font-semibold mb-1">Địa Chỉ</h3>
                    <p className="text-gray-600">
                      Số 1 Võ Văn Ngân, Phường Linh Chiểu,
                      <br />
                      Thành phố Thủ Đức, TP.HCM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <IconWrapper>
                    <IconMail className="text-primary mt-1" />
                  </IconWrapper>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">
                    dsc.hcmute@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <IconWrapper>
                    <IconPhone className="text-primary mt-1" />
                  </IconWrapper>
                  <div>
                    <h3 className="font-semibold mb-1">Điện Thoại</h3>
                    <p className="text-gray-600">
                      (028) 3896 8641
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">Theo Dõi Chúng Tôi</h3>
                <div className="flex space-x-4">
                  <Button
                    type="text"
                    icon={
                      <IconWrapper>
                        <IconBrandFacebook />
                      </IconWrapper>
                    }
                    href="https://facebook.com/hcmute.dsc"
                    target="_blank"
                  />
                  <Button
                    type="text"
                    icon={
                      <IconWrapper>
                        <IconBrandGithub />
                      </IconWrapper>
                    }
                    href="https://github.com/hcmute-dsc"
                    target="_blank"
                  />
                  <Button
                    type="text"
                    icon={
                      <IconWrapper>
                        <IconBrandLinkedin />
                      </IconWrapper>
                    }
                    href="https://linkedin.com/company/hcmute-dsc"
                    target="_blank"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Gửi Tin Nhắn</h2>
              <Form
                form={form}
                name="contact"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                  <Input size="large" placeholder="Nhập họ và tên của bạn" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input size="large" placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Chủ đề"
                  rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
                >
                  <Select size="large" placeholder="Chọn chủ đề">
                    <Option value="general">Thông tin chung</Option>
                    <Option value="event">Sự kiện</Option>
                    <Option value="project">Dự án</Option>
                    <Option value="membership">Thành viên</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Nội dung"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea
                    size="large"
                    rows={6}
                    placeholder="Nhập nội dung tin nhắn của bạn"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block
                    loading={loading}
                  >
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Map Section */}
      <Section 
        className="py-12"
        gradient="secondary"
        pattern="grid"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4842318813793!2d106.7547214761119!3d10.85072635776171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUcC4gSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1704546424469!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="HCMUTE Map"
              className="rounded-lg"
            />
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default Contact; 