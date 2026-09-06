'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/auth/validation';
import { ROUTES } from '@/config/constants';

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const rawData = {
    ownerName: formData.get('ownerName') as string,
    petName: formData.get('petName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        owner_name: validation.data.ownerName,
        pet_name: validation.data.petName,
        phone: validation.data.phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(`${ROUTES.LOGIN}?registered=true`);
}