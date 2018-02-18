import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.net.*;
import java.util.*;
import java.text.*;
import java.math.*;

// NEURON - main NNOD API
// Copyright (C) 2018  Sergey Tolkachev

public class Neuron {
	int nnerves = 0;
	int nnodes = 0;
	int index;
	int port;
	Node nodes[] = new Node[10000];
	Nerve nerves[] = new Nerve[100000];
	int length = 100;
	static int basic_Port = 10000;
	float W = 0;
	double D = 0;
	float T = 0;
	long delay_S = 0;
	static float arg_W = 0;
	static double arg_D = 0;
	static float arg_T = 0;
	static long arg_delay_S = 0;
	static int current_Port = 0;

	public float get_arg_W() {
		return arg_W;
	}	
	public float get_arg_T() {
		return arg_T;
	}	
	public double get_arg_D() {
		return arg_D;
	}	
	public long get_arg_delay_S() {
		return arg_delay_S;
	}	
	public int get_current_Port() {
		return current_Port;
	}	
	public void set_current_Port(int port) {
		current_Port = port;
	}

//////////////////////////////////////////////////////////////////////
	public Neuron(int i) {
		index = i;
		port = index + basic_Port;
		Node n = new Node(this);
		n.id = 0;
		n.name = "" + 0;
		nodes[nnodes] = n;
		n.T = arg_T;
		n.D = arg_D;
		nnodes++;
		Neuro_Layer screen = new Neuro_Layer(this);
		screen.setSize(350, 450);
		int offset = index * 90 + 10;
		if (offset < 0 || offset > 200)
			offset = 90;
		screen.setLocation(offset, offset);
		screen.setVisible(true);
		screen.start();
	}
//////////////////////////////////////////////////////////////////////	
	public static void main(String[] args) {
		try {
			arg_W = Integer.parseInt(args[0]);
		} catch (Exception x) {
			arg_W = 1;
		}
		try {
			arg_D = Integer.parseInt(args[1]);
		} catch (Exception x) {
			arg_D = 1;
		}
		try {
			arg_T = Integer.parseInt(args[2]);
		} catch (Exception x) {
			arg_T = 1;
		}
		try {
			arg_delay_S = Integer.parseInt(args[3]);
		} catch (Exception x) {
			arg_delay_S = 5000;
		}
		
		Neuron neuron = new Neuron(current_Port);

		neuron.W = arg_W;
		neuron.D = arg_D;
		neuron.T = arg_T;
		neuron.delay_S = arg_delay_S;
	}
//////////////////////////////////////////////////////////////////////
	public static class Node {
		Neuron neuron;
		int id = -1;
		int parent_id = -1;
		String name = null;
		double E = 0;
		double curent_E = 0;
		double D = 0;
		double T = 0;
		Date S = null;
		double O = 0;
		String O_URL = "";
		Date E_When = null;
		Date S_When = null;
		Date L_When = null;
		Date C_When = null;
		double W_When = 1;
		Vector<String> v_S_DELAY = null;
		Vector<String> v_L_DELAY = null;
		Vector<String> v_C_DELAY = null;
		int R = 255;
		int G = 255;
		int B = 255;
		boolean fixed;
		boolean charged = false;
		double x = 0;
		double y = 0;
		double dx = 0;
		double dy = 0;
		int w = 60;
		int h = 40;
		
//////////////////////////////////////////////////////////////////////		
		public Node(Neuron n) {
			this.neuron = n;
		}
//////////////////////////////////////////////////////////////////////
		public void discharge_Me() {
			java.util.Date now = new java.util.Date();
			long S_DELAY = 0;
			long L_DELAY = 0;
			long C_DELAY = 0;
			double period = -1;

			if (S_When != null) {
				if (now.getTime() > S_When.getTime()) {
					S_When = null;
					if (v_S_DELAY != null && v_S_DELAY.size() > 0) {
						String str = v_S_DELAY.elementAt(0).toString();
						S_DELAY = Integer.parseInt(str);
						v_S_DELAY.removeElementAt(0);
						Date time = new java.util.Date();
						time.setTime(now.getTime() + S_DELAY);
						if (S_DELAY > 0)
							S_When = time;
					}
					R = 0;
					G = 255;
					B = 0;
					S = new java.util.Date();
					S.setTime(now.getTime() + neuron.delay_S);
				}
			}
			if (L_When != null) {
				if (now.getTime() > L_When.getTime()) {
					L_When = null;
					this.link_Me();

					if (v_L_DELAY != null && v_L_DELAY.size() > 0) {
						String str = v_L_DELAY.elementAt(0).toString();
						if (str.indexOf("(") >= 0) {
							String str2 = str.substring(str.indexOf("(") + 1,
									str.indexOf(")"));
							str = str.substring(0, str.indexOf("("));
							W_When = Float.valueOf(str2).floatValue();

						}
						L_DELAY = Integer.parseInt(str);
						v_L_DELAY.removeElementAt(0);
					}
					Date time = new java.util.Date();
					time.setTime(now.getTime() + L_DELAY);
					if (L_DELAY > 0)
						L_When = time;
				}
			}
			if (C_When != null) {
				if (now.getTime() > C_When.getTime()) {
					C_When = null;
					this.clone_Me();

					if (v_C_DELAY != null && v_C_DELAY.size() > 0) {
						String str = v_C_DELAY.elementAt(0).toString();
						C_DELAY = Integer.parseInt(str);
						v_C_DELAY.removeElementAt(0);
						Date time = new java.util.Date();
						time.setTime(now.getTime() + C_DELAY);
						if (C_DELAY > 0)
							C_When = time;
					}
				}
			}

			if (!charged) {

				E_When = null;
				if (S != null) {
					if (S.getTime() - now.getTime() > 0) {
						double s_Decriment = (double) (S.getTime() - now
								.getTime())
								/ neuron.delay_S;
						s_Decriment = 255 - (int) (s_Decriment * 255);

						R = (int) s_Decriment;
						B = (int) s_Decriment;
					} else {
						S = null;
						R = 255;
						G = 255;
						B = 255;
					}
				}
				return;
			}
			period = now.getTime() - E_When.getTime();
			if (D != -1) {
				if (period > D) {
					charged = false;
					curent_E = 0;
					R = 255;
					G = 255;
					B = 255;
				} else {
					curent_E = E * (D - ((now.getTime() - E_When.getTime())))
							/ D;
					charged = true;
				}
			}

			if (S != null) {
				if (S.getTime() - now.getTime() > 0) {
					double s_Decriment = (double) (S.getTime() - now.getTime())
							/ neuron.delay_S;
					s_Decriment = 255 - (int) (s_Decriment * 255);
					R = (int) s_Decriment;
					B = (int) s_Decriment;
				} else {
					S = null;
					R = 255;
					G = 255;
					B = 255;
				}
			} else {
				if (curent_E > 0) {
					G = 255 - (int) (curent_E * 255);
				} else {
					G = 255;
				}
				if (G > 255)
					G = 255;
				if (G < 0)
					G = 0;
				B = G;
				R = 255;
			}

			if (T < 0) {
				if (curent_E == 0) {
					curent_E = 1;
					charged = true;
					this.fire_Me();
				}
			} else {
				if (curent_E >= T) {
					this.fire_Me();
				}
			}

			if (this.O > 0) {
				this.fire_Me();
			}
		}
		public void excite_Me(double e_d) {
			if (e_d > 1)
				e_d = 1;
			if (e_d < -1)
				e_d = -1;
			java.util.Date now = new java.util.Date();
			E_When = now;
			if (e_d == 1 || e_d == -1 || e_d == 0) {
				curent_E = e_d;
			} else {
				curent_E = curent_E + e_d;
			}
			if (curent_E > 1.0)
				curent_E = 1;
			if (curent_E < -1.0)
				curent_E = -1;
			E = curent_E;
			S = null;
			charged = true;
			if (curent_E <= 0)
				O = 0;
			if (T < 0) {
				if (curent_E == 0) {
					curent_E = 1;
					this.fire_Me();
				}
			} else {
				if (curent_E >= T) {
					this.fire_Me();
				}
			}
		}
		public void fire_Me() {
			double token = 0;
			this.O = 1;
			boolean fired = false;
			for (int i = 0; i < neuron.nnerves; i++) {
				Neuron.Nerve e1 = neuron.nerves[i];
				if (e1.from == this.id) {
					token = this.O * e1.W;
					neuron.nodes[e1.to].excite_Me(token);
					neuron.nodes[e1.to].S = null;

					fired = true;
				}
			}
			this.E = 0;
			this.curent_E = 0;
			if (fired) {
				charged = false;
				this.O = 0;
				R = 255;
				G = 255;
				B = 255;
			}
			if (!O_URL.equals("")) {
				String tmp = "";
				if (O_URL.indexOf("http://") == 0) {
					tmp = O_URL;
				} else {
					tmp = "http://" + O_URL;
				}
				if (O_URL.indexOf("=") < 0) {
					tmp = tmp + "?ID=" + id;
				}
				charged = false;
				this.O = 0;
				R = 255;
				G = 255;
				B = 255;
				String inputLine = "";
				String input = "";
				try {
					URL url = new URL(tmp);
					BufferedReader in = new BufferedReader(
							new InputStreamReader(url.openStream()));
					while ((inputLine = in.readLine()) != null) {
						input = input + inputLine;
					}
					in.close();
				} catch (Exception e) {
					System.out.println(e);
				}
//				System.out.println(input);
			}
		}
		public void link_Me() {
			for (int i = 0; i < neuron.nnodes; i++) {
				Node n = neuron.nodes[i];
				if (n.S != null) {
					neuron.addNerve(this.id, i, neuron.length, this.W_When);
					//				n.S = 0;
				}
			}
		}
		public void clone_Me() {
			try {
				char LF = 0x0A;
				FileInputStream fstream = null;
//				System.out.println(System.getProperty("user.dir"));
				try {
					fstream = new FileInputStream("./" + this.id + ".dna");
				} catch (IOException e) {
					fstream = new FileInputStream("./" + this.parent_id + "-C.dna");
				}
				BufferedReader in = new BufferedReader(new InputStreamReader(
						fstream));

				String theInput = "";
				while ((theInput = in.readLine()) != null) {
					String str = "";
					String str2 = "";

					Vector<String> v_L_DELAY = new Vector<String>();
					Vector<String> v_S_DELAY = new Vector<String>();
					Vector<String> v_C_DELAY = new Vector<String>();

					theInput = theInput.replaceAll("" + LF, " ");
					theInput = theInput.replaceAll("  ", " ");
					StringTokenizer s_Tok = null;
					s_Tok = new StringTokenizer(theInput);
					if (s_Tok.hasMoreTokens()) {
						try {
							str = s_Tok.nextToken();
							StringTokenizer s_Tok2 = new StringTokenizer(str,
									",");
							while (s_Tok2.hasMoreTokens()) {
								str2 = s_Tok2.nextToken();
								v_S_DELAY.add(str2);
							}
						} catch (Exception e) {
							v_S_DELAY = null;
						}
						try {
							str = s_Tok.nextToken();
							StringTokenizer s_Tok2 = new StringTokenizer(str,
									",");
							while (s_Tok2.hasMoreTokens()) {
								str2 = s_Tok2.nextToken();
								v_L_DELAY.add(str2);
							}

						} catch (Exception e) {
							v_L_DELAY = null;
						}
						try {
							str = s_Tok.nextToken();
							StringTokenizer s_Tok2 = new StringTokenizer(str,
									",");
							while (s_Tok2.hasMoreTokens()) {
								str2 = s_Tok2.nextToken();
								v_C_DELAY.add(str2);
							}
						} catch (Exception e) {
							v_C_DELAY = null;
						}
					}
					this.cloneNode(v_S_DELAY, v_L_DELAY, v_C_DELAY);
				}
				in.close();
			} catch (IOException e) {
				cloneNode(null, null, null);
			}
			return;
		}
		public Node cloneNode(Vector<String> v_S_DELAY, Vector<String> v_L_DELAY,
				Vector<String> v_C_DELAY) {
			long S_DELAY = 0;
			long L_DELAY = 0;
			long C_DELAY = 0;

			String str = "";
			String str2 = "";
			Node n = new Node(neuron);

			if (v_S_DELAY != null && v_S_DELAY.size() > 0) {
				str = v_S_DELAY.elementAt(0).toString();
				S_DELAY = Integer.parseInt(str);
				v_S_DELAY.removeElementAt(0);
				n.v_S_DELAY = v_S_DELAY;
			}
			if (v_L_DELAY != null && v_L_DELAY.size() > 0) {
				str = v_L_DELAY.elementAt(0).toString();
				if (str.indexOf("(") >= 0) {
					str2 = str
							.substring(str.indexOf("(") + 1, str.indexOf(")"));
					str = str.substring(0, str.indexOf("("));
					n.W_When = Float.valueOf(str2).floatValue();
				}
				L_DELAY = Integer.parseInt(str);
				v_L_DELAY.removeElementAt(0);
				n.v_L_DELAY = v_L_DELAY;
			}
			if (v_C_DELAY != null && v_C_DELAY.size() > 0) {
				str = v_C_DELAY.elementAt(0).toString();
				C_DELAY = Integer.parseInt(str);
				v_C_DELAY.removeElementAt(0);
				n.v_C_DELAY = v_C_DELAY;
			}
			
			n.id = neuron.nnodes;
			n.parent_id = id;
			n.name = "" + n.id;
			//			n.init();
			n.E_When = E_When;

			Date now = new java.util.Date();
			Date time = new java.util.Date();
			time.setTime(now.getTime() + S_DELAY);
			if (S_DELAY > 0)
				n.S_When = time;
			time = new java.util.Date();
			time.setTime(now.getTime() + L_DELAY);
			if (L_DELAY > 0)
				n.L_When = time;
			time = new java.util.Date();
			time.setTime(now.getTime() + C_DELAY);
			if (C_DELAY > 0)
				n.C_When = time;

			n.curent_E = curent_E;
			n.charged = charged;
			n.E = E;
			n.O = O;
			n.O_URL = O_URL;
			n.D = D;
			n.T = T;
			n.S = S;
//			n.S = null;
			n.R = R;
			n.G = G;
			n.B = B;
			n.dx = dx;
			n.dy = dy;
			n.fixed = false;
			n.x = 10 + 380 * Math.random();
			n.y = 10 + 380 * Math.random();
			neuron.nodes[neuron.nnodes] = n;
			neuron.nnodes++;
			return n;
		}
		public void select_Me() {
			java.util.Date now = new java.util.Date();
			if (S != null) {
				S = null;
				R = 255;
				G = 255;
				B = 255;
				return;
			}
			R = 0;
			G = 255;
			B = 0;
			S = new java.util.Date();
			S.setTime(now.getTime() + neuron.delay_S);
		}
	}
//////////////////////////////////////////////////////////////////////
	public static class Nerve {
		Neuron neuron;
		int from;
		int to;
		double W = 0;
		double len;

//////////////////////////////////////////////////////////////////////
		
		public Nerve(Neuron n) {
			this.neuron = n;
		}
	}
//////////////////////////////////////////////////////////////////////
	public int findNode(int id) {
		String lbl = "" + id;
		for (int i = 0; i < nnodes; i++) {
			if (nodes[i].name.equals(lbl)) {
				return i;
			}
		}
		//  	Node n = neuron.nodes[0].cloneNode(-1, null, null, null);
		//  	return n.id;
		return -1;
	}
	public void addNerve(int from, int to, int len, double W) {
		if (from == to)
			return;
		Nerve e = new Nerve(this);
		e.from = findNode(from);
		e.to = findNode(to);
		for (int i = 0; i < nnerves; i++) {
			Nerve e1 = this.nerves[i];
			if (e1.to == e.to && e1.from == e.from)
				return;
		}
		e.len = len;
		e.W = W;
		nerves[nnerves++] = e;
	}
	public void modNerve(int from, int to, double W) {
		if (from == to)
			return;
		for (int i = 0; i < nnerves; i++) {
			Nerve e = this.nerves[i];
			if (e.to == to && e.from == from) {
				e.W = W;
			}
		}
	}
}
//////////////////////////////////////////////////////////////////////

class Neuro_Layer extends Frame implements ActionListener, ItemListener,
		WindowListener, AdjustmentListener {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7223800914629768858L;
	Neuron neuron;
	GraphPanel panel;
	Panel controlPanel;
	Checkbox relax;
	Button updateButton;
	Button resetButton;
	Scrollbar slider_Weight;
	Scrollbar slider_TreshHold;
	Scrollbar slider_Discharge;
	TextField textField_Weight;
	TextField textField_TreshHold;
	TextField textField_Discharge;
	Label label_W = new Label("W:");
	Label label_D = new Label("D:");
	Label label_T = new Label("T:");	
//////////////////////////////////////////////////////////////////////	
	public Neuro_Layer(Neuron n) {
		super("Exploratorium_" + n.port);
		this.neuron = n;
		listener(neuron);
		setLayout(new BorderLayout());
		panel = new GraphPanel(this, neuron);
		add("Center", panel);
		controlPanel = new Panel();
		add("South", controlPanel);

		relax = new Checkbox("Relax");
		relax.setState(true);
		panel.relax = true;

		updateButton = new Button("Update");
		resetButton = new Button("Reset");

		slider_Weight = new Scrollbar(Scrollbar.HORIZONTAL, 101, 1, 0, 101);
		slider_TreshHold = new Scrollbar(Scrollbar.HORIZONTAL, 101, 1, 0, 101);
		slider_Discharge = new Scrollbar(Scrollbar.HORIZONTAL, 101, 1, 0, 101);

		textField_Weight = new TextField("1.00", 5);
		textField_TreshHold = new TextField("1.00", 5);
		textField_Discharge = new TextField("1.00", 5);

		GridBagConstraints constraints = new GridBagConstraints();
		GridBagLayout aLayout = new GridBagLayout();
		controlPanel.setLayout(aLayout);
		constraints.fill = GridBagConstraints.HORIZONTAL;

		constraints.gridx = 0; // Start column
		constraints.gridy = 0; // Start row

		constraints.gridwidth = 1; // Num. of columns wide
		constraints.gridheight = 2; // Num. of rows high

		constraints.gridx = 0;
		constraints.gridy = 0;
		constraints.insets = new Insets(5, 1, 5, 1);

		constraints.weightx = 0;
		constraints.gridx = 0;
		constraints.anchor = GridBagConstraints.EAST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(label_W, constraints);

		constraints.weightx = 2;
		constraints.gridx = 1;
		constraints.anchor = GridBagConstraints.WEST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(textField_Weight, constraints);

		constraints.weightx = 20;
		constraints.gridx = 2;
		constraints.anchor = GridBagConstraints.WEST;
		constraints.fill = GridBagConstraints.HORIZONTAL;
		aLayout.setConstraints(slider_Weight, constraints);

		constraints.weightx = 2;
		constraints.gridx = 3;
		constraints.anchor = GridBagConstraints.EAST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(relax, constraints);

		constraints.insets = new Insets(1, 1, 5, 1);
		constraints.gridy = 2;
		constraints.gridx = 0;
		constraints.anchor = GridBagConstraints.EAST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(label_T, constraints);

		constraints.gridx = 1;
		constraints.anchor = GridBagConstraints.WEST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(textField_TreshHold, constraints);

		constraints.gridx = 2;
		constraints.anchor = GridBagConstraints.WEST;
		constraints.fill = GridBagConstraints.HORIZONTAL;
		aLayout.setConstraints(slider_TreshHold, constraints);

		constraints.gridx = 3;
		constraints.anchor = GridBagConstraints.EAST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(updateButton, constraints);

		constraints.insets = new Insets(1, 1, 5, 1);
		constraints.gridy = 4;
		constraints.gridx = 0;
		constraints.anchor = GridBagConstraints.EAST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(label_D, constraints);

		constraints.gridx = 1;
		constraints.anchor = GridBagConstraints.WEST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(textField_Discharge, constraints);

		constraints.gridx = 2;
		constraints.anchor = GridBagConstraints.WEST;
		constraints.fill = GridBagConstraints.HORIZONTAL;
		aLayout.setConstraints(slider_Discharge, constraints);

		constraints.gridx = 3;
		constraints.anchor = GridBagConstraints.EAST;
		constraints.fill = GridBagConstraints.NONE;
		aLayout.setConstraints(resetButton, constraints);

		controlPanel.add(label_W);
		controlPanel.add(textField_Weight);
		controlPanel.add(slider_Weight);
		controlPanel.add(relax);
		controlPanel.add(label_T);
		controlPanel.add(textField_TreshHold);
		controlPanel.add(slider_TreshHold);
		controlPanel.add(updateButton);
		controlPanel.add(label_D);
		controlPanel.add(textField_Discharge);
		controlPanel.add(slider_Discharge);
		controlPanel.add(resetButton);

		controlPanel.setBackground(Color.LIGHT_GRAY);
		Color color = new Color(240, 240, 240);
		panel.setBackground(color);

		addWindowListener(this);
		updateButton.addActionListener(this);
		resetButton.addActionListener(this);
		relax.addItemListener(this);
		slider_Weight.addAdjustmentListener(this);
		slider_TreshHold.addAdjustmentListener(this);
		slider_Discharge.addAdjustmentListener(this);
	}
//////////////////////////////////////////////////////////////////////
	public class network_Protocol {
		public String processInput(String theInput) {

			String theOutput = "";
			String tmp1 = null;
			String tmp2 = null;
			String this_Input = null;
			StringTokenizer s_Tok = null;
			StringTokenizer s_Tok2 = null;
			
			this_Input = theInput.toUpperCase();
			this_Input = this_Input.replaceAll("GET /", "");
			
			if (this_Input.indexOf("LAYER") >= 0) {
				int current_Port = neuron.get_current_Port();
				current_Port++;
				neuron.set_current_Port(current_Port);
				Neuron n = new Neuron(current_Port);
				n.W = neuron.get_arg_W();
				n.D = neuron.get_arg_D();
				n.T = neuron.get_arg_T();
				n.delay_S = neuron.get_arg_delay_S();
				theOutput = "Layer created";
				return theOutput;
			}
			
			if (this_Input.indexOf("SAVE") >= 0) {
				theOutput = "SAVE NOT IMPLEMENTED YET";
				return theOutput;
			}
			
			if (this_Input.indexOf("RESTORE") >= 0) {
				theOutput = "RESTORE NOT IMPLEMENTED YET";
				return theOutput;
			}
			
			if (this_Input.indexOf("CLEAR") >= 0) {
				//				neuron.Node.Init(10000);
				//				neuron.Nerve.Init();
				neuron.nnerves = 0;
				neuron.nnodes = 0;

				Neuron.Node n = new Neuron.Node(neuron);
				n.id = 0;
				n.name = "" + 0;
				neuron.nodes[neuron.nnodes] = n;
				neuron.nnodes++;
				//				n.init();

				theOutput = "CLEAR OK";
				return theOutput;
			}
			if (this_Input.indexOf("RESET") >= 0) {
				for (int i = 0; i < neuron.nnodes; i++) {
					neuron.nodes[i].E = 0;
					neuron.nodes[i].O = 0;
					neuron.nodes[i].S = null;
					neuron.nodes[i].curent_E = 0;
					neuron.nodes[i].charged = false;
					neuron.nodes[i].R = 255;
					neuron.nodes[i].G = 255;
					neuron.nodes[i].B = 255;
				}
				theOutput = "RESET OK";
				return theOutput;
			}
			try {
			s_Tok = new StringTokenizer(this_Input, "=");
			if (s_Tok.hasMoreTokens()) {
				tmp1 = s_Tok.nextToken();
				tmp2 = s_Tok.nextToken();
				s_Tok2 = new StringTokenizer(tmp1, " ");
				if (s_Tok2.hasMoreTokens()) {
					tmp1 = s_Tok2.nextToken();
				}
			}
			} catch (Exception e) {
				System.out.println(e + " : " + this_Input);
			}
			
			int from = 0;
			try {
				from = Integer.parseInt(tmp1);

			} catch (NumberFormatException e) {
				from = 0;
			}
			if (from > neuron.nnodes)
				return "Error: No such Node!";
			if (this_Input.indexOf("=L") >= 0) {
				String tmp3 = null;
				String tmp4 = null;
				double W = 0;
				if (s_Tok.hasMoreTokens()) {
					tmp3 = s_Tok.nextToken();
				}
				try {
					W = Float.valueOf(tmp3).floatValue();
				} catch (Exception e) {
					W = 1.0;
				}
				s_Tok = new StringTokenizer(theInput, "=");
				try {
					tmp4 = s_Tok.nextToken();
					tmp4 = s_Tok.nextToken();
					tmp4 = s_Tok.nextToken();
					tmp4 = s_Tok.nextToken();
					if (s_Tok.hasMoreTokens()) {
						tmp4 = tmp4 + "=" + s_Tok.nextToken();
					}
				} catch (Exception e) {
					tmp4 = "";
				}
				s_Tok2 = new StringTokenizer(tmp4, " ");
				if (s_Tok2.hasMoreTokens()) {
					tmp4 = s_Tok2.nextToken();
				}
				if (from >= neuron.nnodes)
					return "Error: No such Node!";
				neuron.nodes[from].O_URL = tmp4;
				for (int i = 0; i < neuron.nnodes; i++) {
					Neuron.Node n = neuron.nodes[i];
					if (n.S != null) {
						neuron.addNerve(from, i, neuron.length, W);
						//						n.S = 0;
					}
				}
				theOutput = "ID=" + neuron.nodes[from].id + " E="
						+ neuron.nodes[from].curent_E + " S="
						+ neuron.nodes[from].S;
				return theOutput;
			}
			
			
			
			if (this_Input.indexOf("=MW") >= 0) {
				String tmp3 = null;
				try {
					tmp3 = s_Tok.nextToken();
				} catch (Exception e) {
					theOutput = "ERROR IN MW STRING";
					return theOutput;
				}

				int f = Integer.parseInt(tmp1);
				int t = Integer.parseInt(tmp2);
				double w = Float.valueOf(tmp3).floatValue();
				
				int decimalPlace = 2;
			    BigDecimal bd = new BigDecimal(w);
			    bd = bd.setScale(decimalPlace,BigDecimal.ROUND_HALF_UP);
			    w = bd.doubleValue();
			    
				neuron.modNerve(f, t, w);

				theOutput = f +"->" + t +" W = " + w;
				return theOutput;
			}
			
			if (this_Input.indexOf("=E") >= 0) {
				neuron.nodes[from].excite_Me(1.0);
			}
			if (this_Input.indexOf("=S") >= 0) {
				neuron.nodes[from].select_Me();
			}
			if (this_Input.indexOf("=C") >= 0) {
				neuron.nodes[from].clone_Me();
			}
			theOutput = "ID=" + neuron.nodes[from].id + " E="
					+ neuron.nodes[from].curent_E + " S="
					+ neuron.nodes[from].S;
			return theOutput;
		}
	}
//////////////////////////////////////////////////////////////////////
	public class MultiServerThread extends Thread {
		private Socket socket = null;
//////////////////////////////////////////////////////////////////////		
		public MultiServerThread(Socket socket) {
			super("MultiServerThread");
			this.socket = socket;
		}
//////////////////////////////////////////////////////////////////////
		public void run() {
			try {
				PrintWriter out = new PrintWriter(socket.getOutputStream(),
						true);
				BufferedReader in = new BufferedReader(new InputStreamReader(
						socket.getInputStream()));
				String inputLine, outputLine;
				while ((inputLine = in.readLine()) != null) {
					if (inputLine.indexOf("=") >= 0)
						break;
				}
				if (inputLine != null) {
					network_Protocol nnp = new network_Protocol();
					outputLine = nnp.processInput(inputLine);
					out.println(outputLine);
				}
				out.close();
				in.close();
				socket.close();

			} catch (IOException e) {
				//   	   	 e.printStackTrace();
			}
		}
	}
//////////////////////////////////////////////////////////////////////
	public void listener(Neuron neuron) {
		final int my_Port = neuron.port;
		new Thread() {
			public void run() {
				ServerSocket serverSocket = null;
				boolean listening = true;
				try {
					serverSocket = new ServerSocket(my_Port);
				} catch (IOException e) {
					System.err.println("Could not listen on port: " + my_Port);
					System.exit(-1);
				}

				while (listening)
					try {
						new MultiServerThread(serverSocket.accept()).start();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
				try {
					serverSocket.close();
				} catch (IOException e2) {
					e2.printStackTrace();
				}
			}
		}.start();
	}
	public void start() {
		panel.start();
	}
//////////////////////////////////////////////////////////////////////
	public void windowClosed(WindowEvent event) {
	}
	public void windowDeiconified(WindowEvent event) {
	}
	public void windowIconified(WindowEvent event) {
	}
	public void windowActivated(WindowEvent event) {
	}
	public void windowDeactivated(WindowEvent event) {
	}
	public void windowOpened(WindowEvent event) {
	}
	public void windowClosing(WindowEvent event) {
		System.exit(0);
	}
	public void itemStateChanged(ItemEvent e) {
		Object src = e.getSource();
		boolean on = e.getStateChange() == ItemEvent.SELECTED;
		if (src == relax)
			panel.relax = on;
	}
	public void actionPerformed(ActionEvent event) {
		if (event.getActionCommand().equals("Reset")) {
			for (int i = 0; i < neuron.nnodes; i++) {
				neuron.nodes[i].E = 0;
				neuron.nodes[i].O = 0;
				neuron.nodes[i].S = null;
				neuron.nodes[i].curent_E = 0;
				neuron.nodes[i].charged = false;
				neuron.nodes[i].R = 255;
				neuron.nodes[i].G = 255;
				neuron.nodes[i].B = 255;
			}
		}

		if (event.getActionCommand().equals("Update")) {
			NumberFormat pattern = new DecimalFormat("##0.00");
			float f = 0;

			String str = "";
			f = slider_TreshHold.getValue();
			f = (f / 100);
			if (f == 0)
				f = -1;
			str = pattern.format(f);
			textField_TreshHold.setText(str);
			neuron.T = Float.valueOf(str).floatValue();

			neuron.D = slider_Discharge.getValue();
			f = slider_Discharge.getValue();
			f = (f / 100);
			str = pattern.format(f);
			textField_Discharge.setText(str);
			if (neuron.D == 100)
				neuron.D = -1;
			if (neuron.D == 0)
				neuron.D = 0.1;
			if (neuron.D != 0 && neuron.D != -1) {
				neuron.D = neuron.D * 10000;
			}
			for (int i = 0; i < neuron.nnodes; i++) {
				if (neuron.nodes[i].S != null) {
					neuron.nodes[i].T = neuron.T;
					neuron.nodes[i].D = neuron.D;
				}
			}
		}
		repaint();
	}
	public void adjustmentValueChanged(AdjustmentEvent e) {
		NumberFormat pattern = new DecimalFormat("##0.00");
		float f = 0;
		String str = "";

		f = slider_Weight.getValue();
		f = (f / 100) * 2 - 1;
		str = pattern.format(f);
		textField_Weight.setText(str);
		neuron.W = Float.valueOf(str).floatValue();

		f = slider_TreshHold.getValue();
		f = (f / 100);
		if (f == 0)
			f = -1;
		str = pattern.format(f);
		textField_TreshHold.setText(str);
		neuron.T = Float.valueOf(str).floatValue();

		neuron.D = slider_Discharge.getValue();
		f = slider_Discharge.getValue();
		f = (f / 100);
		str = pattern.format(f);
		textField_Discharge.setText(str);
		if (neuron.D == 100)
			neuron.D = -1;
		if (neuron.D == 0)
			neuron.D = 0.1;
		if (neuron.D != 0 && neuron.D != -1) {
			neuron.D = neuron.D * 10000;
		}
		for (int i = 0; i < neuron.nnodes; i++) {
			if (neuron.nodes[i].S != null) {
				neuron.nodes[i].T = neuron.T;
				neuron.nodes[i].D = neuron.D;
			}
		}
		repaint();
	}
}