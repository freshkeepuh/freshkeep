'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddLocationSchema } from '@/lib/validationSchemas';
import { Location } from '@prisma/client';

