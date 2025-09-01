import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditStudentForm from '../../../components/EditStudentForm';

const EditStudentPage = async ({ params }: { params: { email: string } }) => {
  const email = decodeURIComponent(params.email); // CAM: this is important

  const studentData = await prisma.studentData.findUnique({
    where: { email },
  });
  const enrollmentData = await prisma.enrollmentData.findUnique({
    where: { email },
  });
  if (!studentData || !enrollmentData) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw notFound();
  }
  const student = { ...studentData, ...enrollmentData };
  console.log('EditStudentPage: ', email, student); // Show server-side email.

  if (!student.bio) student.bio = '';
  return (
    <main>
      <h1 className="text-center">Edit Student</h1>
      <EditStudentForm student={student} />
    </main>
  );
};

export default EditStudentPage;
