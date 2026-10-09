create type public.app_role as enum ('admin','faculty');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.is_staff(_user_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id) $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.user_roles(user_id, role) values (new.id, 'faculty') on conflict do nothing; return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.students (
 id uuid primary key default gen_random_uuid(), roll_no text not null unique, name text not null, department text not null, year int not null default 1,
 cgpa numeric(4,2) not null default 0, attendance int not null default 0, lms_activity int not null default 0, engagement int not null default 0,
 placement_readiness int not null default 0, skills_score int not null default 0, feedback_score int not null default 0, backlogs int not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now());
grant select, insert, update, delete on public.students to authenticated; grant all on public.students to service_role;
alter table public.students enable row level security;
create policy "staff read students" on public.students for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff insert students" on public.students for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "staff update students" on public.students for update to authenticated using (public.is_staff(auth.uid()));
create policy "admin delete students" on public.students for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.interventions (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id) on delete cascade,
 title text not null, category text not null default 'Academic', priority text not null default 'Medium', status text not null default 'Open',
 assigned_to text not null default '', due_date date, notes text not null default '', created_by uuid, created_at timestamptz not null default now());
grant select, insert, update, delete on public.interventions to authenticated; grant all on public.interventions to service_role;
alter table public.interventions enable row level security;
create policy "staff all interventions" on public.interventions for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.data_imports (
 id uuid primary key default gen_random_uuid(), category text not null, filename text not null, row_count int not null default 0,
 status text not null default 'Completed', message text not null default '', created_by uuid, created_at timestamptz not null default now());
grant select, insert on public.data_imports to authenticated; grant all on public.data_imports to service_role;
alter table public.data_imports enable row level security;
create policy "staff read imports" on public.data_imports for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff add imports" on public.data_imports for insert to authenticated with check (public.is_staff(auth.uid()));

insert into public.students (roll_no,name,department,year,cgpa,attendance,lms_activity,engagement,placement_readiness,skills_score,feedback_score,backlogs) values
('KR2024001','Aarav Patel','Civil',3,6.24,73,38,62,47,33,67,0),
('KR2024002','Diya Shinde','Civil',2,5.02,59,52,33,36,39,92,3),
('KR2024003','Rohan Iyer','Computer Science',4,9.05,99,78,35,28,22,84,0),
('KR2024004','Ananya Kulkarni','Civil',4,7.4,70,73,64,66,65,69,0),
('KR2024005','Kabir Kulkarni','Civil',3,9.19,85,72,79,26,20,67,0),
('KR2024006','Isha Patel','Information Tech',4,7.43,80,56,48,89,86,92,0),
('KR2024007','Vihaan Reddy','Civil',4,9.13,83,71,59,79,66,45,0),
('KR2024008','Meera Mehta','Mechanical',2,7.66,86,75,94,81,74,61,0),
('KR2024009','Arjun Gupta','Computer Science',2,9.26,94,84,40,41,48,61,0),
('KR2024010','Sneha Nair','Electronics',2,7.28,83,71,85,40,37,59,0),
('KR2024011','Aditya Kulkarni','Information Tech',4,5.15,65,24,83,33,26,48,3),
('KR2024012','Riya Nair','Civil',3,6.18,78,69,70,75,73,87,3),
('KR2024013','Karan Sharma','Information Tech',2,6.95,70,46,93,53,41,73,0),
('KR2024014','Pooja Shinde','Mechanical',3,8.15,80,49,39,48,52,92,0),
('KR2024015','Nikhil Gupta','Electronics',4,6.17,74,42,58,26,14,58,1),
('KR2024016','Tanvi Rao','Mechanical',4,5.85,60,26,63,22,22,93,0),
('KR2024017','Yash Deshmukh','Civil',4,6.45,77,56,79,44,35,84,1),
('KR2024018','Kavya Shinde','Mechanical',3,8.45,86,85,94,79,78,50,0),
('KR2024019','Siddharth Gupta','Information Tech',4,9.11,83,94,30,27,26,58,0),
('KR2024020','Neha Deshmukh','Civil',2,8.96,91,90,30,69,81,83,0),
('KR2024021','Rahul Iyer','Electronics',2,7.32,65,74,75,54,61,44,0),
('KR2024022','Priya Joshi','Information Tech',2,5.43,59,44,67,64,63,91,1),
('KR2024023','Omkar Sharma','Mechanical',2,5.66,64,24,77,30,44,50,1),
('KR2024024','Sakshi Mehta','Information Tech',4,6.21,71,43,54,29,41,59,2),
('KR2024025','Harsh Sharma','Electronics',2,7.59,73,59,61,21,19,50,0),
('KR2024026','Aditi Sharma','Electronics',2,5.98,55,29,72,59,58,82,3),
('KR2024027','Varun Shinde','Information Tech',2,6.77,68,53,78,88,86,73,3),
('KR2024028','Shreya Reddy','Information Tech',2,8.26,83,71,90,72,83,91,0),
('KR2024029','Manav Patel','Electronics',4,8.54,80,77,30,38,25,76,0),
('KR2024030','Ira Iyer','Electronics',2,7.93,76,56,57,76,63,88,0),
('KR2024031','Dev Gupta','Civil',4,8.97,81,70,49,26,21,58,0),
('KR2024032','Nisha Patel','Mechanical',3,5.08,62,38,29,93,100,93,0),
('KR2024033','Pranav Joshi','Information Tech',4,5.71,55,26,54,88,97,54,1),
('KR2024034','Mitali Patel','Mechanical',2,7.22,71,72,37,87,80,40,0),
('KR2024035','Rudra Shinde','Electronics',2,7.6,75,54,25,94,91,90,0),
('KR2024036','Zoya Deshmukh','Mechanical',3,7.26,68,51,28,35,29,56,0);

insert into public.interventions (student_id,title,category,priority,status,assigned_to,due_date,notes)
select id,'Academic mentoring plan','Academic','High','Open','Dr. A. Kulkarni', current_date + 7,'Weekly check-ins on backlog subjects.' from public.students where roll_no='KR2024002'
union all select id,'Attendance counselling','Attendance','High','In Progress','Prof. S. Rao', current_date + 3,'Meet with guardian.' from public.students where roll_no='KR2024026'
union all select id,'Placement aptitude bootcamp','Placement','Medium','Open','Placement Cell', current_date + 14,'Enroll in aptitude + mock interviews.' from public.students where roll_no='KR2024005'
union all select id,'Skills workshop enrollment','Skills','Low','Completed','Prof. M. Nair', current_date - 2,'Completed Python workshop.' from public.students where roll_no='KR2024015';

insert into public.data_imports (category,filename,row_count,status,message) values
('Academic','sem5_grades.csv',36,'Completed','All rows validated'),
('Attendance','attendance_sep.csv',36,'Completed','All rows validated'),
('LMS','lms_activity.csv',34,'Warning','2 rows skipped: unknown roll number');